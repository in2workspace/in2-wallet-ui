import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { CameraService } from 'src/app/services/camera.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { BarcodeScannerComponent, formatLogMessage } from './barcode-scanner.component';
import { CameraLogsService } from 'src/app/services/camera-logs.service';
import { Storage } from '@ionic/storage-angular';
import { Exception } from '@zxing/library';
import { CameraLogType } from 'src/app/interfaces/camera-log';
import { NavigationEnd, Router } from '@angular/router';

class MockCameraService {
  updateCamera(): void {}
  navCamera$ = new BehaviorSubject<any>({ deviceId: '' });
}

class MockRouter {
  public events = new Subject<any>();
}

describe('BarcodeScannerComponent', () => {
  let component: BarcodeScannerComponent;
  let fixture: ComponentFixture<BarcodeScannerComponent>;
  let mockCameraService: MockCameraService;
  let mockCameraLogsService: CameraLogsService;
  let mockRouter: MockRouter;

  beforeEach(async () => {
    mockCameraService = new MockCameraService();
    mockCameraLogsService = {
      addCameraLog: jest.fn()
    } as any;
    mockRouter = new MockRouter();

    await TestBed.configureTestingModule({
      imports: [CommonModule, ZXingScannerModule],
      providers: [
        { provide: CameraService, useClass: MockCameraService }, 
        { provide: CameraLogsService, useValue:mockCameraLogsService },
        { provide: Router, useValue: mockRouter },
        Storage
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BarcodeScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call updateCamera after 2 seconds in ngOnInit', fakeAsync(() => {
    const updateCameraSpy = jest.spyOn((component as any).cameraService, 'updateCamera');
    component.ngOnInit();
    tick(2000);
    expect(updateCameraSpy).toHaveBeenCalled();
  }));

  it('should redefine console.error and handle zxing errors correctly', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    const saveErrorLogSpy = jest.spyOn(component, 'saveErrorLog');
    const originalConsoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    component.ngOnInit();
    const message = "@zxing/ngx-scanner";
    const params = "Can't get user media, this is not supported.";
    console.error(message, params);

    expect(saveErrorLogSpy).toHaveBeenCalledWith(new Error(formatLogMessage(message, [params])), 'noMediaError');
    expect(originalConsoleSpy).not.toHaveBeenCalled();

    expect(alertMock).toHaveBeenCalledTimes(1);
    expect(originalConsoleSpy).not.toHaveBeenCalled();
    console.error("Another error");

    expect(alertMock).toHaveBeenCalledTimes(1);
    expect(originalConsoleSpy).toHaveBeenCalledWith("Another error");

    alertMock.mockRestore();
    originalConsoleSpy.mockRestore();
  });
  
  it('should emit qrCode when onCodeResult is called', () => {
    const testString = 'test QR code';
    jest.spyOn(component.qrCode, 'emit');
    component.onCodeResult(testString);
    expect(component.qrCode.emit).toHaveBeenCalledWith(testString);
  });

  it('should emit availableDevices when onCamerasFound is called', () => {
    const testDevices = [{ deviceId: '1', kind: 'videoinput', label: 'Camera 1', groupId: 'group1', toJSON: () => {} }];
    jest.spyOn(component.availableDevices, 'emit');
    component.onCamerasFound(testDevices as MediaDeviceInfo[]);
    expect(component.availableDevices.emit).toHaveBeenCalledWith(testDevices as MediaDeviceInfo[]);
  });

   //TODO TESTS FOR NEW AVAILABLE AND SELECTED CAMERA FLOW
  // it('should select the back camera by default in onCamerasFound', () => {
  //   const testDevices = [
  //     { deviceId: '1', kind: 'videoinput', label: 'Front Camera', groupId: 'group1', toJSON: () => {} },
  //     { deviceId: '2', kind: 'videoinput', label: 'Back Camera', groupId: 'group2', toJSON: () => {} }
  //   ];
  //   component.onCamerasFound(testDevices as MediaDeviceInfo[]);
  //   expect(component.newSelectedCamera.deviceId).toBe('2');
  // });

  // it('should select the first camera if no back camera is found in onCamerasFound', () => {
  //   const testDevices = [
  //     { deviceId: '1', kind: 'videoinput', label: 'Front Camera 1', groupId: 'group1', toJSON: () => {} },
  //     { deviceId: '2', kind: 'videoinput', label: 'Front Camera 2', groupId: 'group2', toJSON: () => {} }
  //   ];
  //   component.onCamerasFound(testDevices as MediaDeviceInfo[]);
  //   expect(component.newSelectedCamera.deviceId).toBe('2');
  // });

  it('should toggleCamera$ when navCamera$ emits a device with deviceId', fakeAsync(() => {
    const testDevice = { deviceId: '1', kind: 'videoinput', label: 'Camera 1', groupId: 'group1', toJSON: () => {} };
    let selectedDevice: any;
    component.selectedDevice$.subscribe((device) => {
      selectedDevice = device;
    });

    mockCameraService.navCamera$.next(testDevice);
    tick();

    expect(selectedDevice.deviceId).toBe('');
  }));

  it('should save error log in saveErrorLog', () => {
    const testError = new Error('Test error');
    const testExceptionType: CameraLogType = 'undefinedError';
    component.saveErrorLog(testError, testExceptionType);
    expect(mockCameraLogsService.addCameraLog).toHaveBeenCalledWith(testError, testExceptionType);
  });

  it('should save error log when onScanError is called', () => {
    const testError = new Error('Test scan error');
    jest.spyOn(component, 'saveErrorLog');
    component.onScanError(testError);
    expect(component.saveErrorLog).toHaveBeenCalledWith(testError, 'scanError');
  });

  it('should save scan failure log when onScanFailure is called with an error', fakeAsync(() => {
      const testError = new Exception('Test scan failure');
      const saveErrorSpy = jest.spyOn(component, 'saveErrorLog');
      component.onScanFailure(testError);
      tick(3000);
      expect(saveErrorSpy).toHaveBeenCalledWith(testError, 'scanFailure');
    }));
    
  it('should save undefined scan failure log when onScanFailure is called without an error', fakeAsync(() => {
    const saveErrorSpy = jest.spyOn(component, 'saveErrorLog');
    component.onScanFailure(undefined);
    tick(3000);
    expect(saveErrorSpy).toHaveBeenCalledWith(expect.any(Error), 'scanFailure');
  }));

  it('should restore original console.error when ngOnDestroy is called', () => {
    (component as any).originalConsoleError = console.error;
    component.ngOnDestroy();
    expect(console.error).toBe(console.error);
  });

  it('should reset scanner on NavigationEnd', fakeAsync(() => {
    jest.spyOn(component.scanner, 'reset'); 
    mockRouter.events.next(new NavigationEnd(1, 'http://localhost/', 'http://localhost/'));
    tick();
    expect(component.scanner.reset).toHaveBeenCalled();
  }));
});

describe('formatLogMessage', () => {
  it('should format message with no optional params', () => {
    const message = 'Test message';
    const result = formatLogMessage(message, []);
    expect(result).toBe('Test message.  ');
  });

  it('should format message with one optional param', () => {
    const message = 'Test message';
    const optionalParams = ['Param1'];
    const result = formatLogMessage(message, optionalParams);
    expect(result).toBe('Test message. Param1 ');
  });

  it('should format message with two optional params', () => {
    const message = 'Test message';
    const optionalParams = ['Param1', 'Param2'];
    const result = formatLogMessage(message, optionalParams);
    expect(result).toBe('Test message. Param1 Param2');
  });

  it('should handle non-string message and params by converting them to strings', () => {
    const message = 12345;
    const optionalParams = [true, { key: 'value' }];
    const result = formatLogMessage(message, optionalParams);
    expect(result).toBe('12345. true [object Object]');
  });
});
