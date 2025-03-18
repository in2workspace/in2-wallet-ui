import { TestBed, ComponentFixture, tick, fakeAsync, flush, waitForAsync } from '@angular/core/testing';
import { SettingsPage } from './settings.page';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LangChangeEvent, TranslateFakeLoader, TranslateLoader, TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { CameraLogsService } from 'src/app/services/camera-logs.service';
import { Observable, of, throwError } from 'rxjs';
import { IonicModule, NavController } from '@ionic/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';


const translateServiceMock = {
  currentLang: 'de',
  onLangChange: new EventEmitter<LangChangeEvent>(),
  use: jest.fn(),
  get: jest.fn().mockImplementation((key: string): Observable<string> => {
    return of(key);
  }),
  onTranslationChange: new EventEmitter(),
  onDefaultLangChange: new EventEmitter()
};


describe('SettingsPage', () => {
  let component: SettingsPage;
  let fixture: ComponentFixture<SettingsPage>;
  let router: Router;
  let cameraLogsService: CameraLogsService;
  let translateService: TranslateService;
  let navCtrl: NavController;


  beforeEach(async () => {
    const routerMock = {
      navigate: jest.fn(),
      events: of('/'),
      createUrlTree: (commands:any, navExtras = {}) => {}
    };
    const cameraLogsServiceMock = {
      fetchCameraLogs: jest.fn().mockResolvedValue(true), // Mock async method
      sendCameraLogs: jest.fn()
    };
    const navCtrlMock = { navigateForward: jest.fn() };
   


    await TestBed.configureTestingModule({
    schemas: [NO_ERRORS_SCHEMA],
    declarations: [TranslatePipe],
    imports: [
        SettingsPage,
        IonicModule.forRoot(),
        RouterModule.forRoot([]),
        TranslateModule.forRoot()
    ],
    providers: [
        { provide: Router, useValue: routerMock },
        { provide: CameraLogsService, useValue: cameraLogsServiceMock },
        { provide: TranslateService, useValue: translateServiceMock },
        { provide: NavController, useValue: navCtrlMock },
        { provide: ActivatedRoute, useValue: { snapshot: { data: { data: "" } } } }
    ]
}).compileComponents();
 
    fixture = TestBed.createComponent(SettingsPage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    cameraLogsService = TestBed.inject(CameraLogsService);
    translateService = TestBed.inject(TranslateService);
    navCtrl = TestBed.inject(NavController);
   
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    fixture.detectChanges();
  });


  it('should configure TranslateService correctly', () => {
    expect(translateService.get).toBeDefined();
    expect(translateService.onLangChange).toBeDefined();
  });


  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch and send camera logs on sendCameraLogs', (done) => {
    const translateSpy = jest.spyOn(translateService, 'get').mockReturnValue(of('translated_message'));
    const fetchLogsSpy = jest.spyOn(cameraLogsService, 'fetchCameraLogs').mockResolvedValue();
    const sendLogsSpy = jest.spyOn(cameraLogsService, 'sendCameraLogs');


    component.sendCameraLogs();
 
    setTimeout(() => {
      expect(translateSpy).toHaveBeenCalledWith('mailto_permission_alert');
      expect(fetchLogsSpy).toHaveBeenCalled();
      expect(sendLogsSpy).toHaveBeenCalled();
      done();
    }, 0);
  });
 
 
 
  it('should log error when sendCameraLogs fails', (done) => {
    const translateSpy = jest.spyOn(translateService, 'get').mockReturnValue(of('translated_message'));
    const fetchLogsSpy = jest.spyOn(cameraLogsService, 'fetchCameraLogs').mockRejectedValue(new Error('Fetch error'));
    const sendLogsSpy = jest.spyOn(cameraLogsService, 'sendCameraLogs');
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
 
    component.sendCameraLogs();
   
    setTimeout(() => {
      expect(translateSpy).toHaveBeenCalledWith('mailto_permission_alert');
      expect(fetchLogsSpy).toHaveBeenCalled();
      expect(sendLogsSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error sending camera logs:', new Error('Fetch error'));
      done();
    }, 0);
  });
 
});



