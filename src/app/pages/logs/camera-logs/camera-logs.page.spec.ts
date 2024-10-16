import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CameraLogsPage } from './camera-logs.page';
import { InfiniteScrollCustomEvent, IonicModule } from '@ionic/angular';
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

  it('should load more logs when infinite scroll is triggered', async () => {
    const mockLogs = [
      { id: 1, message: 'Log 1', date: new Date() },
      { id: 2, message: 'Log 2', date: new Date() },
      { id: 3, message: 'Log 3', date: new Date() },
      { id: 4, message: 'Log 4', date: new Date() },
    ];
    (component as any).logsBatchSize = 2;
    
    mockCameraLogsService.getCameraLogs.mockResolvedValue(mockLogs);
    await component.ngOnInit();
  
    expect(component.displayedLogs.length).toBe(2);
    expect(component.displayedLogs).toEqual(mockLogs.slice(0, 2));

    const mockInfiniteScrollEvent = {
      target: {
        complete: jest.fn(),
        disabled: false
      }
    } as unknown as InfiniteScrollCustomEvent;
  
    component.loadLogs(mockInfiniteScrollEvent);
  
    expect(component.displayedLogs.length).toBe(4);
    expect(component.displayedLogs).toEqual(mockLogs);
  
    expect(mockInfiniteScrollEvent.target.complete).toHaveBeenCalled();
    expect(mockInfiniteScrollEvent.target.disabled).toBe(true);
  });
  
});
