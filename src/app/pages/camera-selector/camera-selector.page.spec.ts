import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CameraSelectorPage } from './camera-selector.page';
import { CameraService } from 'src/app/services/camera.service';
import { CameraLogsService } from 'src/app/services/camera-logs.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

describe('CameraSelectorPage', () => {
  let component: CameraSelectorPage;
  let fixture: ComponentFixture<CameraSelectorPage>;
  let cameraServiceMock: any;
  let routerMock: any;
  let cdrMock: any;
  let storageMock: any;
  let cameraLogsServiceMock: any;
  let activatedRouteMock: any;

  beforeEach(async () => {
    cameraServiceMock = {
      navCamera$: new BehaviorSubject({ deviceId: '123' }),
      changeCamera: jest.fn(),
      noCamera: jest.fn(),
    };

    routerMock = {
      events: new BehaviorSubject<NavigationEnd | null>(null),
      navigate: jest.fn(),
    };

    cdrMock = {
      detectChanges: jest.fn(),
    };

    cameraLogsServiceMock = {
        log: jest.fn(),
      };

    storageMock = {
      get: jest.fn(),
      set: jest.fn(),
    };

    activatedRouteMock = {
        snapshot: { paramMap: { get: jest.fn() } }
      }

    await TestBed.configureTestingModule({
      imports: [
        CameraSelectorPage,
        IonicModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: CameraService, useValue: cameraServiceMock },
        { provide: CameraLogsService, useValue: cameraLogsServiceMock }, 
        { provide: Router, useValue: routerMock },
        { provide: ChangeDetectorRef, useValue: cdrMock },
        { provide: Storage, useValue: storageMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock}
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CameraSelectorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set the default selected device to "Default"', () => {
    component.selectedDevice$.subscribe((deviceId) => {
      expect(deviceId).toBe('123');
    });
  });

  it('should call changeCamera when onDeviceSelectChange is called with a valid device', () => {
    const mockDevice = { deviceId: '123', label: 'Mock Device' } as MediaDeviceInfo;
    component.availableDevices = [mockDevice];
    
    component.onDeviceSelectChange('123');
    expect(cameraServiceMock.changeCamera).toHaveBeenCalledWith(mockDevice);
  });

  it('should call noCamera when onDeviceSelectChange is called with an empty string', () => {
    component.onDeviceSelectChange('');
    expect(cameraServiceMock.noCamera).toHaveBeenCalled();
  });

  it('should prioritize rear cameras when availableDevicesEmit is called', () => {
    const devices: MediaDeviceInfo[] = [
      { deviceId: '123', label: 'Front Camera' } as MediaDeviceInfo,
      { deviceId: '456', label: 'Back Camera' } as MediaDeviceInfo,
    ];
    component.availableDevicesEmit(devices);
    expect(component.availableDevices.length).toBe(1);
    expect(component.availableDevices[0].deviceId).toBe('456'); 
  });


  it('should listen to router events and reset barcode if conditions match', () => {
    (component as any).componentIsInitialized = true;
    const spy = jest.spyOn(component, 'resetBarcode');
    routerMock.events.next(new NavigationEnd(1, '/tabs/camera-selector', '/tabs/camera-selector'));
    expect(spy).toHaveBeenCalled();
  });
});
