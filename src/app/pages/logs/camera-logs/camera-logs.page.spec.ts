import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CameraLogsPage } from './camera-logs.page';
import { IonicModule } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { CameraLogsService } from 'src/app/services/camera-logs.service';
import { Storage } from '@ionic/storage-angular';

describe('CameraLogsPage', () => {
  let component: CameraLogsPage;
  let fixture: ComponentFixture<CameraLogsPage>;
  let cameraLogsService: CameraLogsService;

  const mockCameraLogsService = {
    getCameraLogs: jest.fn()
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule, DatePipe],
      providers: [
        { provide: CameraLogsService, useValue: mockCameraLogsService },
        Storage
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CameraLogsPage);
    component = fixture.componentInstance;
    cameraLogsService = TestBed.inject(CameraLogsService);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load camera logs on initialization', async () => {
    const mockLogs = [{ id: 1, log: 'Camera log 1' }];
    mockCameraLogsService.getCameraLogs.mockResolvedValue(mockLogs);

    await component.ngOnInit();

    expect(mockCameraLogsService.getCameraLogs).toHaveBeenCalled();
    expect(component.cameraLogs).toEqual(mockLogs);
  });
});
