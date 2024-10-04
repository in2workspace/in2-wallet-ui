import { TestBed } from '@angular/core/testing';

import { CameraLogsService } from './camera-logs.service';
import { StorageService } from './storage.service';
import { Storage } from '@ionic/storage-angular';

describe('CameraLogsService', () => {
  let service: CameraLogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[StorageService, CameraLogsService, Storage]
    });
    service = TestBed.inject(CameraLogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
