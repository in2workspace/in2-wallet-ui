import { TestBed, ComponentFixture } from '@angular/core/testing';
import { SettingsPage } from './settings.page';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DataService } from 'src/app/services/data.service';
import { CameraLogsService } from 'src/app/services/camera-logs.service';
import { of, throwError } from 'rxjs';
import { IonicModule, NavController } from '@ionic/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SettingsPage', () => {
  let component: SettingsPage;
  let fixture: ComponentFixture<SettingsPage>;
  let router: Router;
  let dataService: DataService;
  let cameraLogsService: CameraLogsService;
  let translateService: TranslateService;
  let navCtrl: NavController;

  beforeEach(async () => {
    const routerMock = { navigate: jest.fn() };
    const dataServiceMock = { getDid: jest.fn() };
    const cameraLogsServiceMock = { fetchCameraLogs: jest.fn(), sendCameraLogs: jest.fn() };
    const translateServiceMock = { get: jest.fn().mockReturnValue(of('mock translation')),
        onLangChange: of({ lang: 'en' }),
        instant: () => "mock"
     };
    const navCtrlMock = { navigateForward: jest.fn() };

    await TestBed.configureTestingModule({
        declarations:[TranslatePipe],
        imports: [
        SettingsPage,
          IonicModule.forRoot(),
          RouterModule.forRoot([]),
          TranslateModule.forRoot({
            loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
          })
        ],
        providers: [
          { provide: Router, useValue: routerMock },
          { provide: DataService, useValue: dataServiceMock },
          { provide: CameraLogsService, useValue: cameraLogsServiceMock },
          { provide: TranslateService, useValue: translateServiceMock },
          { provide: NavController, useValue: navCtrlMock },
          { provide: ActivatedRoute, useValue: { snapshot: { data: { data: "" } } } }
        ]
      }).compileComponents();
  
    fixture = TestBed.createComponent(SettingsPage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    dataService = TestBed.inject(DataService);
    cameraLogsService = TestBed.inject(CameraLogsService);
    translateService = TestBed.inject(TranslateService);
    navCtrl = TestBed.inject(NavController);
    
    jest.spyOn(console, 'error').mockImplementation(() => {});
    fixture.detectChanges();
  });

  it('should configure TranslateService correctly', () => {
    expect(translateService.get).toBeDefined();
    expect(translateService.onLangChange).toBeDefined();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

//   it('should navigate to credentials on success in goHomeWithEBSI', () => {
//     (dataService.getDid as jest.Mock).mockReturnValue(of({}));
    
//     component.goHomeWithEBSI();
    
//     expect(dataService.getDid).toHaveBeenCalled();
//     expect(router.navigate).toHaveBeenCalledWith(['/tabs/credentials']);
//   });

//   it('should open alert on error in goHomeWithEBSI', () => {
//     (dataService.getDid as jest.Mock).mockReturnValue(throwError('Error'));
    
//     component.goHomeWithEBSI();
    
//     expect(component.isAlertOpen).toBe(true);
//     expect(console.error).toHaveBeenCalledWith('Error');
//   });

//   it('should toggle the alert', () => {
//     component.isAlertOpen = false;
//     component.toggleAlert();
//     expect(component.isAlertOpen).toBe(true);

//     component.toggleAlert();
//     expect(component.isAlertOpen).toBe(false);
//   });

//   it('should fetch and send camera logs on sendCameraLogs', async () => {
//     (translateService.get as jest.Mock).mockReturnValue(of('Permission alert'));
//     (cameraLogsService.fetchCameraLogs as jest.Mock).mockResolvedValue(null);
    
//     await component.sendCameraLogs();

//     expect(translateService.get).toHaveBeenCalledWith('mailto_permission_alert');
//     expect(cameraLogsService.fetchCameraLogs).toHaveBeenCalled();
//     expect(cameraLogsService.sendCameraLogs).toHaveBeenCalled();
//     expect(alert).toHaveBeenCalledWith('Permission alert');
//   });

//   it('should log error when sendCameraLogs fails', async () => {
//     (translateService.get as jest.Mock).mockReturnValue(of('Permission alert'));
//     (cameraLogsService.fetchCameraLogs as jest.Mock).mockRejectedValue('Error');
    
//     await component.sendCameraLogs();
    
//     expect(console.error).toHaveBeenCalledWith('Error sending camera logs:', 'Error');
//   });
});
