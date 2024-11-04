import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LangChangeEvent, TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AlertController } from '@ionic/angular';
import { WalletService } from 'src/app/services/wallet.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
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
  let mockRouter: Router;
  let walletService: WalletService;
  let alertController: AlertController;
  let translateService: TranslateService;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    mockRouter = {
      navigate: jest.fn().mockImplementation(()=>Promise.resolve(true)),
    } as any;

    walletService = {
      executeVC: jest.fn().mockReturnValue(of({})),
    } as any;

    alertController = {
      create: jest.fn().mockResolvedValue({
        present: jest.fn().mockImplementation(()=>Promise.resolve()),
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
        { provide: Router, useValue: mockRouter },
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

  it('should select correct index on click', ()=>{
    component.isClick=[true, false];
    const selected = component.isClicked(1);
    expect(selected).toBe(false);
  });

  it('should toggle isClick value when selectCred is called', () => {
    component.credList = [{}] as any;
    component.isClick = [false];
    component.selectCred({} as any, 0);
    expect(component.isClick[0]).toBe(true);
  });

  it('sendCred should create an alert', async ()=>{
    const alertCreateSpy = jest.spyOn(alertController, 'create');
    await component.sendCred({} as any);
    expect(alertCreateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        header: expect.any(String),
        buttons: expect.arrayContaining([
          expect.objectContaining({
            text: expect.any(String),
            role: 'cancel',
          }),
          expect.objectContaining({
            text: expect.any(String),
            role: 'ok',
          }),
        ]),
      })
    );
    const alert = await alertCreateSpy.mock.results[0].value;
    expect(alert.present).toHaveBeenCalled();
    expect(alert.onDidDismiss).toHaveBeenCalled();
  });

  it('should add cred to _VCReply.selectedVcList when sendCred is called with confirmation', async ()=>{
    const mockCred = {mock:true};
    await component.sendCred({mock:true} as any);
    expect(component._VCReply.selectedVcList).toEqual([...component.credList, mockCred]);
  });


  it('should call walletService.executeVC, set sendCredentialAlert as true an empty selCredList when sendCred is called with confirmation', async () => {
    await component.sendCred({} as any);

    expect(walletService.executeVC).toHaveBeenCalled();
    expect(component.sendCredentialAlert).toBe(true);
    expect(component.selCredList).toEqual([]);
    expect(component._VCReply.selectedVcList.length).toBe(1);
  });

  it('should not call walletService.executeVC when sendCred is called with confirmation', async () => {
    component.sendCredentialAlert = false;
    component.credList = [{mock1:true}, {mock2:true}] as any;
    jest.spyOn(alertController, 'create').mockResolvedValue({
      present: jest.fn().mockResolvedValueOnce(undefined),
      onDidDismiss: jest.fn().mockResolvedValue({ role: 'cancel' }),
    } as any);
    await component.sendCred({} as any);
    expect(walletService.executeVC).not.toHaveBeenCalled();
  });

  it('should handle error when sendCred execution fails', async () => {
    component.selCredList =[{mock1:true}, {mock2:false}] as any;
    component.sendCredentialAlert = false;
    const error = new Error('Mock error');
    const executeSpy = jest.spyOn(walletService, 'executeVC').mockReturnValue(throwError(() => error));
    const routerSpy = jest.spyOn(mockRouter, 'navigate');
    
    await component.sendCred({} as any);

    expect(executeSpy).toHaveBeenCalled();

    setTimeout(() => {
      expect(routerSpy).toHaveBeenCalledWith(['/tabs/credentials']);
      expect(component.selCredList.length).toBe(0);
      expect(component.sendCredentialAlert).toBe(false);
    }, 0);
  });

   it('errorMessage should create an alert', async ()=>{
    const alertCreateSpy = jest.spyOn(alertController, 'create');
    await (component as any).errorMessage();
    expect(alertCreateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        header: expect.any(String),
        buttons: expect.arrayContaining([
          expect.objectContaining({
            text: expect.any(String),
            role: 'ok',
          })
        ]),
        cssClass:"custom-close-button"
      })
    );
    const alert = await alertCreateSpy.mock.results[0].value;
    expect(alert.present).toHaveBeenCalled();
    expect(alert.onDidDismiss).toHaveBeenCalled();
  });

  it('should set sendCredentialAlert when setOpen is called', () => {
    component.setOpen(true);
    expect(component.sendCredentialAlert).toBe(true);
  });

});
