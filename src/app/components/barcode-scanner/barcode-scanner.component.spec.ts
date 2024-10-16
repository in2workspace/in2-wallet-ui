import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { CameraService } from 'src/app/services/camera.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { BarcodeScannerComponent } from './barcode-scanner.component';
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
  let mockRouter: MockRouter;

  beforeEach(async () => {
    mockCameraService = new MockCameraService();
    mockRouter = new MockRouter();

    await TestBed.configureTestingModule({
      imports: [CommonModule, ZXingScannerModule],
      providers: [{ provide: Router, useValue: mockRouter }, { provide: CameraService, useClass: MockCameraService }]
    }).compileComponents();

    fixture = TestBed.createComponent(BarcodeScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit qrCode when onCodeResult is called', () => {
    const testString = 'test QR code';
    spyOn(component.qrCode, 'emit');
    component.onCodeResult(testString);
    expect(component.qrCode.emit).toHaveBeenCalledWith(testString);
  });

  it('should emit availableDevices when onCamerasFound is called', () => {
    const testDevices = [{ deviceId: '1', kind: 'videoinput', label: 'Camera 1', groupId: 'group1', toJSON: () => {} }];
    spyOn(component.availableDevices, 'emit');
    component.onCamerasFound(testDevices as MediaDeviceInfo[]);
    expect(component.availableDevices.emit).toHaveBeenCalledWith(testDevices as MediaDeviceInfo[]);
  });

  it('should select the back camera by default in onCamerasFound', () => {
    const testDevices = [
      { deviceId: '1', kind: 'videoinput', label: 'Front Camera', groupId: 'group1', toJSON: () => {} },
      { deviceId: '2', kind: 'videoinput', label: 'Back Camera', groupId: 'group2', toJSON: () => {} }
    ];
    component.onCamerasFound(testDevices as MediaDeviceInfo[]);
    expect(component.newSelectedCamera.deviceId).toBe('2');
  });

  it('should select the first camera if no back camera is found in onCamerasFound', () => {
    const testDevices = [
      { deviceId: '1', kind: 'videoinput', label: 'Front Camera 1', groupId: 'group1', toJSON: () => {} },
      { deviceId: '2', kind: 'videoinput', label: 'Front Camera 2', groupId: 'group2', toJSON: () => {} }
    ];
    component.onCamerasFound(testDevices as MediaDeviceInfo[]);
    expect(component.newSelectedCamera.deviceId).toBe('2');
  });

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

  it('should reset scanner on NavigationEnd', fakeAsync(() => {
    spyOn(component.scanner, 'reset'); 

    mockRouter.events.next(new NavigationEnd(1, 'http://localhost/', 'http://localhost/'));
    tick();

    expect(component.scanner.reset).toHaveBeenCalled();
  }));
});
