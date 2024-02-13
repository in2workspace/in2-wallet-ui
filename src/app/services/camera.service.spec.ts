import { TestBed } from '@angular/core/testing';
import { CameraService } from './camera.service';
import { StorageService } from './storage.service';


describe('CameraService', () => {
  let cameraService: CameraService;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('StorageService', ['get', 'set', 'remove']);
    TestBed.configureTestingModule({
      providers: [
        CameraService,
        {provide: StorageService, useValue: spy},
      ],
    });
    cameraService = TestBed.inject(CameraService);
  });

  it('should be created', () => {
    expect(cameraService).toBeTruthy();
  });
  
});
