import { TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { CameraService } from './camera.service';
import { StorageService } from './storage.service';

const mockCamera = {
  deviceId: 'existingCameraId',
  groupId: 'existingGroupId',
  kind: 'videoinput',
  label: 'Existing Camera',
  toJSON() { return {}; }
}

class MockStorageService {
  private storage = new Map<string, any>();

  async set(key: string, value: any): Promise<void> {
    this.storage.set(key, value);
  }

  async get(key: string): Promise<any> {
    return this.storage.get(key);
  }

  async remove(key: string): Promise<void> {
    this.storage.delete(key);
  }
}

describe('CameraService', () => {
  let cameraService: CameraService;
  let mockStorageService: MockStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CameraService,
        { provide: StorageService, useClass: MockStorageService },
      ],
    });

    cameraService = TestBed.inject(CameraService);
    mockStorageService = TestBed.inject(StorageService) as unknown as MockStorageService;
  });

  it('should change camera', fakeAsync(() => {
    const mockCamera: MediaDeviceInfo = {
      deviceId: 'newCameraId',
      groupId: 'newGroupId',
      kind: 'videoinput',
      label: 'New Camera',
      toJSON() { return {}; }
    };

    cameraService.changeCamera(mockCamera);
    tick();

    cameraService.navCamera$.subscribe((camera) => {
      expect(camera?.deviceId).toEqual('newCameraId');
      expect(camera?.kind).toEqual('videoinput');
    });

    flush();
  }));

  it('should update camera if exists and is valid', async () => {
    const mockEnumerateDevices = jest.fn(async () => {
      return new Promise<{}[]>(resolve => {
          resolve([mockCamera])
      })
    })
    Object.defineProperty(globalThis.navigator, 'mediaDevices', {
      value: {
          enumerateDevices: mockEnumerateDevices,
      },
      configurable: true
    });
    jest.spyOn(mockStorageService, 'get').mockReturnValue(Promise.resolve(mockCamera));

    await cameraService.updateCamera();

    cameraService.navCamera$.subscribe((camera) => {
      expect(camera?.deviceId).toEqual('existingCameraId');
      expect(camera?.label).toEqual('Existing Camera');
    });

  });

  it('should set camera to null if not available', async () => {
    const mockUnavailableCamera: MediaDeviceInfo = {
      deviceId: 'unavailableCameraId',
      groupId: 'unavailableGroupId',
      kind: 'videoinput',
      label: 'Unavailable Camera',
      toJSON() { return {}; }
    };

    const mockEnumerateDevices = jest.fn(async () => {
      return new Promise<{}[]>(resolve => {
          resolve([mockUnavailableCamera])
      })
    })

    Object.defineProperty(globalThis.navigator, 'mediaDevices', {
      value: {
          enumerateDevices: mockEnumerateDevices,
      },
      configurable: true
    });

    jest.spyOn(mockStorageService, 'get').mockReturnValue(Promise.resolve(mockCamera));
    const noCameraSpy = jest.spyOn(cameraService, 'noCamera');

    await cameraService.updateCamera();
  
    expect(noCameraSpy).toHaveBeenCalled();
  });


  it('isCameraAvailable should return true if camera is available', async () => {
    const mockEnumerateDevices = jest.fn(async () => {
      return new Promise<{}[]>(resolve => {
          resolve([mockCamera])
      })
    })
    Object.defineProperty(globalThis.navigator, 'mediaDevices', {
      value: {
          enumerateDevices: mockEnumerateDevices,
      },
      configurable: true
    });

    const result = await cameraService.isCameraAvailable(mockCamera as MediaDeviceInfo);
    expect(result).toBe(true);
  });

  it('isCameraAvailable should return false if camera is not available', async () => {
    const mockEnumerateDevices = jest.fn(async () => {
      return new Promise<{}[]>(resolve => {
          resolve([])
      })
    })
    Object.defineProperty(globalThis.navigator, 'mediaDevices', {
      value: {
          enumerateDevices: mockEnumerateDevices,
      },
      configurable: true
    });

    const result = await cameraService.isCameraAvailable(mockCamera as MediaDeviceInfo);
    expect(result).toBe(false);
  });
});