import { TestBed } from '@angular/core/testing';
import { CameraLogsService, LOGS_PREFIX, timestampUntilMinutes } from './camera-logs.service';
import { StorageService } from './storage.service';
import { of, throwError } from 'rxjs';
import { CameraLog } from '../interfaces/camera-log';
import { environment } from 'src/environments/environment';

jest.mock('src/environments/environment', () => ({
  environment: {
    LOGS_EMAIL: 'test@example.com' 
  }
}));

describe('CameraLogsService', () => {
  let service: CameraLogsService;
  let storageServiceMock: any;

  beforeEach(() => {
    storageServiceMock = {
      get: jest.fn(),
      set: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        CameraLogsService,
        { provide: StorageService, useValue: storageServiceMock }
      ]
    });

    service = TestBed.inject(CameraLogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCameraLogs', () => {
    it('should fetch logs if not already loaded', async () => {
      const mockLogs: CameraLog[] = [{ type: 'scanError', message: 'Test error', date: '2024-01-01 12:00' }];
      storageServiceMock.get.mockResolvedValueOnce(JSON.stringify(mockLogs));

      const logs = await service.getCameraLogs();
      expect(logs.length).toBe(1);
      expect(logs[0].message).toBe('Test error');
    });
  });

  describe('setCameraLogs', () => {
    it('should set camera logs', () => {
      const mockLogs: CameraLog[] = [{ type: 'scanError', message: 'Test log', date: '2024-01-01 12:00' }];
      service.setCameraLogs(mockLogs);
      expect(service['cameraLogs']).toEqual(mockLogs);
    });
  });

  describe('fetchCameraLogs', () => {
    it('should fetch and parse logs from storage', async () => {
      const mockLogs: CameraLog[] = [{ type: 'scanError', message: 'Test error', date: '2024-01-01 12:00' }];
      storageServiceMock.get.mockResolvedValueOnce(JSON.stringify(mockLogs));

      await service.fetchCameraLogs();
      expect(service['cameraLogs']).toEqual(mockLogs);
    });

    it('should handle error and log error message', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      storageServiceMock.get.mockRejectedValueOnce(new Error('Storage error'));

      await service.fetchCameraLogs();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching logs:', expect.any(Error));
      consoleErrorSpy.mockRestore();
    });
  });

  describe('addCameraLog', () => {
    it('should add a new log and save it to storage', async () => {
      const mockLogs: CameraLog[] = [];
      storageServiceMock.get.mockResolvedValueOnce(JSON.stringify(mockLogs));
      storageServiceMock.set.mockResolvedValueOnce(null);
  
      await service.addCameraLog(new Error('New error'), 'scanError');
  
      const lastCallArgs = storageServiceMock.set.mock.calls[0][1];
      const logs = JSON.parse(lastCallArgs);
      expect(typeof logs[0].date).toBe('string'); 
  
      expect(storageServiceMock.set).toHaveBeenCalledWith(
        LOGS_PREFIX,
        expect.any(String) 
      );
    });

    it('should not exceed 50 logs when adding a new log', async () => {
      const mockLogs: CameraLog[] = Array.from({ length: 50 }, (_, i) => ({
        type: 'scanError',
        message: `Test log ${i + 1}`,
        date: '2024-01-01 12:00'
      }));
      storageServiceMock.get.mockResolvedValueOnce(JSON.stringify(mockLogs));
      storageServiceMock.set.mockResolvedValueOnce(null);
  
      await service.addCameraLog(new Error('New error'), 'scanError');

      const lastCallArgs = storageServiceMock.set.mock.calls[0][1];
      const logs = JSON.parse(lastCallArgs);
  
      expect(logs.length).toBe(50);
  
      expect(logs[0].message).toBe('Test log 2');
      expect(logs[logs.length - 1].message).toBe('New error');
    });
  });

  describe('sendCameraLogs', () => {
    it('should alert if no logs are found', async () => {
      jest.spyOn(window, 'alert').mockImplementation(() => {});
      const logs: CameraLog[] = [];
      jest.spyOn(service, 'getCameraLogs').mockResolvedValueOnce(logs);
  
      await service.sendCameraLogs();
  
      expect(window.alert).toHaveBeenCalledWith('Could not find any stored log');
    });
  
    it('should open mail client with logs in the body', async () => {
      const mockLogs: CameraLog[] = [
        { type: 'scanError', message: 'Test log 1', date: '2024-01-01 12:00' },
        { type: 'scanError', message: 'Test log 2', date: '2024-01-01 13:00' }
      ];
      jest.spyOn(service, 'getCameraLogs').mockResolvedValueOnce(mockLogs);
  
      const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
  
      await service.sendCameraLogs();
  
      const expectedBody = `${encodeURIComponent(JSON.stringify(mockLogs[0]))}%0A${encodeURIComponent(JSON.stringify(mockLogs[1]))}`;
  
      const expectedMailto = `mailto:${environment.LOGS_EMAIL}?subject=Camera%20Logs&body=${expectedBody}`;
  
      expect(openSpy).toHaveBeenCalledWith(expectedMailto, '_blank');
    });
    
  });
  

  describe('timestampUntilMinutes', () => {
    it('should return the current timestamp in the format YYYY-MM-DD HH:mm', () => {
      const mockDate = new Date(2024, 9, 14, 15, 30);
      jest.spyOn(window, 'Date').mockImplementation(() => mockDate);
  
      const result = timestampUntilMinutes();
  
      expect(result).toBe('2024-10-14 15:30');
    });
  });
  
  

});
