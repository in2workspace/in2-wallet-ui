import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { CameraService } from './camera.service';
import { StorageService } from './storage.service';


describe('CameraService', () => {
  let cameraService: CameraService;
  let storageServiceSpy: jasmine.SpyObj<StorageService>

  beforeEach(() => {
    const spy = jasmine.createSpyObj('StorageService', ['get', 'set', 'remove']);
    TestBed.configureTestingModule({
      //imports: [HttpClientTestingModule, HttpClientModule],
      providers: [
        CameraService,
        {provide: StorageService, useValue: spy},
      ],
    });
    cameraService = TestBed.inject(CameraService);
    storageServiceSpy = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
  });

  it('should be created', () => {
    expect(cameraService).toBeTruthy();
  });
  /*
  it('should initialize with default values', () => {
    expect(cameraService.navEnabled$).toBeTruthy();
    expect(cameraService.navCamera$).toBeTruthy();
    expect(cameraService.navEnabled$.getValue()).toBe(false);
    expect(cameraService.navCamera$.getValue()).toEqual(cameraService.mediaDeviceInfoNull);
  });

  it('should change camera and update storage', () => {
    const newCamera: MediaDeviceInfo = {
      deviceId: '123',
      groupId: '456',
      kind: 'videoinput',
      label: 'Front Camera',
    };

    cameraService.changeCamera(newCamera);

    expect(cameraService.navEnabled$.getValue()).toBe(true);
    expect(cameraService.navCamera$.getValue()).toEqual(newCamera);
    expect(storageServiceSpy.set).toHaveBeenCalledWith('camara', newCamera);
  });

  it('should update camera from storage', async () => {
    const storedCamera: MediaDeviceInfo = {
      deviceId: '789',
      groupId: '012',
      kind: 'videoinput',
      label: 'Back Camera',
    };

    storageServiceSpy.get.and.resolveTo(storedCamera);

    await cameraService.updateCamera();

    expect(cameraService.navEnabled$.getValue()).toBe(true);
    expect(cameraService.navCamera$.getValue()).toEqual(storedCamera);
  });

  it('should handle no camera', () => {
    cameraService.noCamera();

    expect(cameraService.navEnabled$.getValue()).toBe(false);
    expect(storageServiceSpy.remove).toHaveBeenCalledWith('camara');
  });
  */
});
