import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LangChangeEvent, TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AlertController } from '@ionic/angular';
import { WalletService } from 'src/app/services/wallet.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { VcSelectorPage } from './vc-selector.page';
import { EventEmitter } from '@angular/core';

const translateServiceMock = {
    currentLang: 'de',
    onLangChange: new EventEmitter<LangChangeEvent>(),
    use: jest.fn(),
    get: jest.fn().mockImplementation((key: string): Observable<string> => {
      return of(key);
    }),
    instant: jest.fn().mockReturnValue('mocked_translation'),
    onTranslationChange: new EventEmitter(),
    onDefaultLangChange: new EventEmitter()
  };

describe('VcSelectorPage', () => {
  let component: VcSelectorPage;
  let fixture: ComponentFixture<VcSelectorPage>;
  let router: Router;
  let walletService: WalletService;
  let alertController: AlertController;
  let translateService: TranslateService;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    router = {
      navigate: jest.fn(),
    } as any;

    walletService = {
      executeVC: jest.fn().mockReturnValue(of({})),
    } as any;

    alertController = {
      create: jest.fn().mockResolvedValue({
        present: jest.fn(),
        onDidDismiss: jest.fn().mockResolvedValue({ role: 'ok' }),
      }),
    } as any;

    activatedRoute = {
      queryParams: of({
        executionResponse: JSON.stringify({
          redirectUri: 'testUri',
          state: 'testState',
          nonce: 'testNonce',
          selectableVcList: [],
        }),
      }),
    } as any;

    TestBed.configureTestingModule({
        imports:[TranslateModule.forRoot()],
        declarations:[TranslatePipe],
      providers: [
        { provide: Router, useValue: router },
        { provide: WalletService, useValue: walletService },
        { provide: AlertController, useValue: alertController },
        { provide: TranslateService, useValue: translateServiceMock },
        { provide: ActivatedRoute, useValue: activatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VcSelectorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize credList and isClick arrays in ngOnInit', () => {
    component.ngOnInit();
    expect(component.credList).toEqual([]);
    expect(component.isClick.length).toBe(0);
  });

  it('should toggle isClick value when selectCred is called', () => {
    component.credList = [{}] as any; // Mock credentials
    component.isClick = [false];
    component.selectCred({} as any, 0);
    expect(component.isClick[0]).toBe(true);
  });

  it('should call walletService.executeVC when sendCred is called with confirmation', async () => {
    await component.sendCred({} as any);
    expect(alertController.create).toHaveBeenCalled();
    expect(walletService.executeVC).toHaveBeenCalled();
  });

  it('should handle error when sendCred execution fails', async () => {
    walletService.executeVC = jest.fn().mockReturnValueOnce(of({ error: 'error' }));
    await component.sendCred({} as any);
    expect(router.navigate).toHaveBeenCalledWith(['/tabs/home']);
  });

  it('should set sendCredentialAlert when setOpen is called', () => {
    component.setOpen(true);
    expect(component.sendCredentialAlert).toBe(true);
  });
});
