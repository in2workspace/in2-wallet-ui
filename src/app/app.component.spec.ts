import { TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { LangChangeEvent, TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { IonicModule, NavController, PopoverController } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AuthenticationService } from './services/authentication.service';
import { StorageService } from './services/storage.service';
import { Observable, of } from 'rxjs';
import { LogoutPage } from './pages/logout/logout.page';
import { EventEmitter } from '@angular/core';

describe('AppComponent', () => {
  let component: AppComponent;
  let mockAuthenticationService: any;
  let mockRouter: any;
  let mockPopoverController: any;
  let mockTranslateService: any;
  let mockStorageService: any;
  let mockActivatedRoute: any;
  let navCtrl: NavController;
  let fixture: any;

  beforeEach(async () => {
      mockAuthenticationService = {
        getName: jest.fn(() => of('John Doe')),
        logout: jest.fn(() => of(null))
      };

      mockRouter = {
        navigate: jest.fn()
      };

      mockPopoverController = {
        create: jest.fn().mockResolvedValue({
            present: jest.fn().mockImplementation(() => Promise.resolve({})),
            dismiss: jest.fn().mockImplementation(()=>Promise.resolve(true)),
        }),
      };
      
      mockTranslateService = {
        currentLang: 'de',
        addLangs: jest.fn(),
        setDefaultLang: jest.fn(),
        get: jest.fn().mockImplementation((key: string): Observable<string> => {
          return of(key);
        }),
        onLangChange: new EventEmitter<LangChangeEvent>(),
        use: jest.fn(),
        onTranslationChange: new EventEmitter(),
        onDefaultLangChange: new EventEmitter()
      };

      mockStorageService = {
        get: jest.fn(() => Promise.resolve('en')),
        set: jest.fn(() => Promise.resolve())
      };

      mockActivatedRoute = {
        snapshot: {
          paramMap: {
            get: jest.fn().mockReturnValue('mockParam')
          }
        }
      };

      const navCtrlMock = { navigateForward: jest.fn() };

      await TestBed.configureTestingModule({
        declarations:[TranslatePipe],
        imports:[IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [
          { provide: ActivatedRoute, useValue: mockActivatedRoute },
          { provide: AuthenticationService, useValue: mockAuthenticationService },
          { provide: Router, useValue: mockRouter },
          { provide: PopoverController, useValue: mockPopoverController },
          { provide: TranslateService, useValue: mockTranslateService },
          { provide: StorageService, useValue: mockStorageService },
          { provide: NavController, useValue: navCtrlMock },
        ]
      })
      .overrideProvider(PopoverController, { useValue: mockPopoverController })
      .compileComponents();

      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    }
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set default language and get language from storage on init', async () => {
    await mockStorageService.get.mockResolvedValue('en');
    expect(mockTranslateService.setDefaultLang).toHaveBeenCalledWith('en');
    expect(mockStorageService.get).toHaveBeenCalledWith('language');
  });

  it('should call getName on AuthenticationService during ngOnInit', () => {
    component.ngOnInit();
    expect(mockAuthenticationService.getName).toHaveBeenCalled();
    component.userName?.subscribe((name) => {
      expect(name).toBe('John Doe');
    });
  });

  it('should call logout and navigate to home', () => {
    component.logout();
    expect(mockAuthenticationService.logout).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home'], {});
  });

  it('should open popover when handleKeydown is called', async () => {
    const mockEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    component.openPopover = jest.fn();
    component.handleKeydown(mockEvent);
    expect(component.openPopover).toHaveBeenCalled();
  });

  it('should create a popover on openPopover call and present it', async () => {   
    const popoverSpy = jest.spyOn(mockPopoverController, 'create');
    const mockPopoverData = {
      component: LogoutPage,
      event: new Event('click'),
      translucent: true,
      cssClass: 'custom-popover',
    } as any;

    await component.openPopover(mockPopoverData);

    expect(popoverSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        component: LogoutPage,
        event: expect.anything(),
        translucent: true,
        cssClass: 'custom-popover',
      })
    );

    const popover = await popoverSpy.mock.results[0].value;
    expect(popover.present).toHaveBeenCalled();

  });
});