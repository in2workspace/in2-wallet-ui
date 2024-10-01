import { TestBed } from '@angular/core/testing';

import { CameraLogsService } from './camera-logs.service';

describe('CameraLogsService', () => {
  let service: CameraLogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CameraLogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
