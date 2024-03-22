import { TestBed } from '@angular/core/testing';
import { CameraService } from './camera.service';
import { StorageService } from './storage.service';

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

  it('should change camera', (done) => {
    const mockCamera: MediaDeviceInfo = {
      deviceId: 'newCameraId',
      groupId: 'newGroupId',
      kind: 'videoinput',
      label: 'New Camera',
      toJSON() { return {}; }
    };

    cameraService.changeCamera(mockCamera);
    cameraService.navCamera$.subscribe((camera) => {
      expect(camera.deviceId).toEqual('newCameraId');
      expect(camera.kind).toEqual('videoinput');
      done();
    });
  });

  it('should update camera if exists', async (done) => {
    const mockCamera: MediaDeviceInfo = {
      deviceId: 'existingCameraId',
      groupId: 'existingGroupId',
      kind: 'videoinput',
      label: 'Existing Camera',
      toJSON() { return {}; }
    };

    await mockStorageService.set('camara', mockCamera);
    cameraService.navCamera$.subscribe((camera) => {
      if (camera.deviceId !== '') {
        expect(camera.deviceId).toEqual('existingCameraId');
        expect(camera.label).toEqual('Existing Camera');
        done();
      }
    });
  });

  it('should set camera to null on noCamera', (done) => {
    cameraService.noCamera();
    cameraService.navCamera$.subscribe((camera) => {
      expect(camera.deviceId).toEqual('');
      expect(camera.kind).toEqual('audiooutput');
      done();
    });
  });
});
