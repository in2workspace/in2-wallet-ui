import { TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { IonicModule, NavController, PopoverController } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AuthenticationService } from './services/authentication.service';
import { StorageService } from './services/storage.service';
import { of } from 'rxjs';
import { LogoutPage } from './pages/logout/logout.page';

describe('AppComponent', () => {
  let component: AppComponent;
  let mockAuthenticationService: any;
  let mockRouter: any;
  let mockPopoverController: any;
  let mockTranslateService: any;
  let mockStorageService: any;
  let mockActivatedRoute: any;
  let navCtrl: NavController;

  beforeEach(
    waitForAsync(() => {
      mockAuthenticationService = {
        getName: jest.fn(() => of('John Doe')),
        logout: jest.fn(() => of(null))
      };

      mockRouter = {
        navigate: jest.fn()
      };

      mockPopoverController = {
        create: jest.fn().mockResolvedValue({
          present: jest.fn().mockImplementation(()=>Promise.resolve())
        })
      };

      mockTranslateService = {
        addLangs: jest.fn(),
        setDefaultLang: jest.fn(),
        get: jest.fn()
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

      TestBed.configureTestingModule({
        imports:[IonicModule.forRoot()],
        providers: [
          { provide: ActivatedRoute, useValue: mockActivatedRoute },
          { provide: AuthenticationService, useValue: mockAuthenticationService },
          { provide: Router, useValue: mockRouter },
          { provide: PopoverController, useValue: mockPopoverController },
          { provide: TranslateService, useValue: mockTranslateService },
          { provide: StorageService, useValue: mockStorageService },
          { provide: NavController, useValue: navCtrlMock },
        ]
      }).compileComponents();

      const fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
    })
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

  //TODO problema semblant al de toast service
  it('should create a popover on openPopover call and present it', async () => {
    const popoverSpy = jest.spyOn(mockPopoverController, 'create');
    const mockEvent = new Event('click');
    await component.openPopover(mockEvent);

    expect(popoverSpy).toHaveBeenCalled();
    
    // .toHaveBeenCalledWith(
    //   expect.objectContaining({
    //     component: LogoutPage,
    //     event: mockEvent,
    //     translucent: true,
    //     cssClass: 'custom-popover',
    //   })
    // );

    const popover = await popoverSpy.mock.results[0].value;
    expect(popover.present).toHaveBeenCalled();

  });
});
