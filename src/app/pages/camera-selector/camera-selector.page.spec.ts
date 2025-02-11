import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CameraSelectorPage } from './camera-selector.page';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { BarcodeScannerComponent } from 'src/app/components/barcode-scanner/barcode-scanner.component';
import { CameraService } from 'src/app/services/camera.service';
import { ChangeDetectorRef, Component, signal } from '@angular/core';
import { of } from 'rxjs';
import { CameraLogsService } from 'src/app/services/camera-logs.service';
import { ToastServiceHandler } from 'src/app/services/toast.service';

@Component({
    selector: 'app-barcode-scanner',
    template: '',
    standalone: true
  })
  class MockBarcodeScannerComponent {}

describe('CameraSelectorPage', () => {
  let component: CameraSelectorPage;
  let fixture: ComponentFixture<CameraSelectorPage>;
  let cameraServiceMock: jest.Mocked<CameraService>;
  let cdrMock: jest.Mocked<any>;
  let storageMock: any;
  let cameraLogsServiceMock: any;

  beforeEach(async () => {
    cameraServiceMock = {
      availableDevices$: of([]),
      activatingBarcodeList$: of([]),
      addActivatingBarcode: jest.fn(),
      getCameraFlow: jest.fn(),
      getAvailableCameraById: jest.fn(),
      handleCameraErrors: jest.fn(),
      isCameraAvailableById: jest.fn(),
      isCameraError$: signal(false),
      setCamera: jest.fn(),
      removeActivatingBarcode: jest.fn(),
      selectedCamera$: signal(null),
      updateAvailableCameras: jest.fn()
    } as unknown as jest.Mocked<CameraService>;

    // cdrMock = {
    //   detectChanges: jest.fn(),
    // } as unknown as jest.Mocked<ChangeDetectorRef>;

    cameraLogsServiceMock = {
        log: jest.fn(),
      };

    storageMock = {
      get: jest.fn(),
      set: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        IonicModule,
        TranslateModule.forRoot(),
        CameraSelectorPage,
        MockBarcodeScannerComponent
      ],
      providers: [
        { provide: CameraService, useValue: cameraServiceMock },
        { provide: Storage, useValue: storageMock },
        ToastServiceHandler,
        { provide: CameraLogsService, useValue: cameraLogsServiceMock }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CameraSelectorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const changeDetectorRef = fixture.debugElement.injector.get(ChangeDetectorRef);
    cdrMock = jest.spyOn(changeDetectorRef.constructor.prototype, 'detectChanges');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ionViewWillEnter and createBarcode when showBarcode is false', () => {
    component.showBarcode = false;
    jest.spyOn(component as any, 'createBarcode');

    (component as any).ionViewWillEnter();

    expect(component['createBarcode']).toHaveBeenCalled();
  });

  it('should not call createBarcode if showBarcode is already true', () => {
    component.showBarcode = true;
    jest.spyOn(component as any, 'createBarcode');

    (component as any).ionViewWillEnter();

    expect(component['createBarcode']).not.toHaveBeenCalled();
  });

  it('should call ionViewWillLeave and destroyBarcode', async () => {
    jest.spyOn(component as any, 'destroyBarcode');

    await (component as any).ionViewWillLeave();

    expect(component['destroyBarcode']).toHaveBeenCalled();
  });

  it('handle camera errors', ()=>{
    component.handleCameraErrorAndReload();
    expect(cameraServiceMock.handleCameraErrors).toHaveBeenCalledWith({name: 'CustomNoAvailable'}, 'fetchError');
  });

  it('should set isChangingDevice to true and then false after 2 seconds', fakeAsync(() => {
    component.showIsChangingDeviceTemp();
    expect(component.isChangingDevice).toBe(true);

    tick(2000);
    expect(component.isChangingDevice).toBe(false);
  }));

  it('should set showBarcode to true and call detectChanges', () => {

    component.createBarcode();

    expect(component.showBarcode).toBe(true);
    expect(cdrMock).toHaveBeenCalled();
  });

  it('should set showBarcode to false and call detectChanges', () => {

    component.destroyBarcode();

    expect(component.showBarcode).toBe(false);
    expect(cdrMock).toHaveBeenCalled();
  });

  it('should call showIsChangingDeviceTemp and updateAvailableCameras', async () => {
    const selectedDeviceId = 'camera-1';
    jest.spyOn(component as any, 'showIsChangingDeviceTemp');
    cameraServiceMock.updateAvailableCameras.mockResolvedValue([{ deviceId: selectedDeviceId } as MediaDeviceInfo]);

    await component.onDeviceSelectChange(selectedDeviceId);

    expect(component['showIsChangingDeviceTemp']).toHaveBeenCalled();
    expect(cameraServiceMock.updateAvailableCameras).toHaveBeenCalled();
  });

  it('should call handleCameraErrorAndReload if no cameras are available', async () => {
    const selectedDeviceId = 'camera-1';
    jest.spyOn(component as any, 'handleCameraErrorAndReload');
    cameraServiceMock.updateAvailableCameras.mockResolvedValue([]);

    await component.onDeviceSelectChange(selectedDeviceId);

    expect(component['handleCameraErrorAndReload']).toHaveBeenCalled();
  });

  it('should set the selected camera if it is available', async () => {
    const selectedDeviceId = 'camera-1';
    const mockDevice = { deviceId: selectedDeviceId } as MediaDeviceInfo;

    cameraServiceMock.updateAvailableCameras.mockResolvedValue([mockDevice]);
    cameraServiceMock.isCameraAvailableById.mockReturnValue(true);
    cameraServiceMock.getAvailableCameraById.mockReturnValue(mockDevice);

    await component.onDeviceSelectChange(selectedDeviceId);

    expect(cameraServiceMock.isCameraAvailableById).toHaveBeenCalledWith(selectedDeviceId);
    expect(cameraServiceMock.getAvailableCameraById).toHaveBeenCalledWith(selectedDeviceId);
    expect(cameraServiceMock.setCamera).toHaveBeenCalledWith(mockDevice);
  });

  it('should call handleCameraErrorAndReload if selected camera is not available', async () => {
    const selectedDeviceId = 'camera-1';

    cameraServiceMock.updateAvailableCameras.mockResolvedValue([{ deviceId: 'camera-2' } as MediaDeviceInfo]);
    cameraServiceMock.isCameraAvailableById.mockReturnValue(false);
    jest.spyOn(component as any, 'handleCameraErrorAndReload');

    await component.onDeviceSelectChange(selectedDeviceId);

    expect(cameraServiceMock.isCameraAvailableById).toHaveBeenCalledWith(selectedDeviceId);
    expect(component['handleCameraErrorAndReload']).toHaveBeenCalled();
  });



});
