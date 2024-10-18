import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CameraSelectorPage } from './camera-selector.page';
import { CameraService } from 'src/app/services/camera.service';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BarcodeScannerComponent } from '../../components/barcode-scanner/barcode-scanner.component';
import { of } from 'rxjs';

describe('CameraSelectorPage', () => {
  let component: CameraSelectorPage;
  let fixture: ComponentFixture<CameraSelectorPage>;
  let cameraServiceMock: any;

  beforeEach(async () => {
    cameraServiceMock = {
      navCamera$: of({ deviceId: '123' }),
      changeCamera: jest.fn(),
      noCamera: jest.fn(),
    };

    await TestBed.configureTestingModule({
    // declarations:[BarcodeScannerComponent],
      imports: [
        IonicModule.forRoot(),
        FormsModule,
        TranslateModule.forRoot(),
        BarcodeScannerComponent
      ],
      providers: [
        Storage,
        { provide: CameraService, useValue: cameraServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(CameraSelectorPage);
    component = fixture.componentInstance;
    component.availableDevices = [
      { deviceId: '123', label: 'Back Camera' } as MediaDeviceInfo,
      { deviceId: '456', label: 'Front Camera' } as MediaDeviceInfo,
    ];
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set available devices correctly', () => {
    expect(component.availableDevices.length).toBe(2);
    expect(component.availableDevices[0].label).toBe('Back Camera');
    expect(component.availableDevices[1].label).toBe('Front Camera');
  });

  it('should call changeCamera when a valid device is selected', () => {
    const selectedDeviceId = '123';
    component.onDeviceSelectChange(selectedDeviceId);
    expect(cameraServiceMock.changeCamera).toHaveBeenCalledWith({
      deviceId: '123',
      label: 'Back Camera',
    });
  });

  it('should call noCamera when an empty selection is made', () => {
    const selectedDeviceId = '';
    component.onDeviceSelectChange(selectedDeviceId);
    expect(cameraServiceMock.noCamera).toHaveBeenCalled();
  });
});
