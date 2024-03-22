import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { CameraService } from 'src/app/services/camera.service';
import { BehaviorSubject } from 'rxjs';
import { BarcodeScannerComponent } from './barcode-scanner.component';

class MockCameraService {
  updateCamera(): void {}
  navCamera$ = new BehaviorSubject<any>({ deviceId: '' });
}

describe('BarcodeScannerComponent', () => {
  let component: BarcodeScannerComponent;
  let fixture: ComponentFixture<BarcodeScannerComponent>;
  let mockCameraService: MockCameraService;

  beforeEach(async () => {
    mockCameraService = new MockCameraService();

    await TestBed.configureTestingModule({
      imports: [CommonModule, ZXingScannerModule],
      providers: [{ provide: CameraService, useClass: MockCameraService }]
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

  it('should toggleCamera$ when navCamera$ emits a device with deviceId', () => {
    const testDevice = { deviceId: '1', kind: 'videoinput', label: 'Camera 1', groupId: 'group1', toJSON: () => {} };
    component.selectedDevice$.subscribe((device) => {
      if (device.deviceId === '1') {
        expect(component.toggleCamera$.value).toBe(true);
      }
    });
    mockCameraService.navCamera$.next(testDevice);
  });
});
