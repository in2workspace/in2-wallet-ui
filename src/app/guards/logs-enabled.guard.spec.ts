import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { logsEnabledGuard } from './logs-enabled.guard';
import { environment } from 'src/environments/environment';

describe('logsEnabledGuard', () => {
  let mockRouter: Router;
  let navigateSpy: jest.SpyInstance;

  beforeEach(() => {
    mockRouter = { navigate: jest.fn() } as any; 

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter }
      ]
    });

    navigateSpy = jest.spyOn(mockRouter, 'navigate');
  });

  afterEach(() => {
    jest.clearAllMocks(); 
  });

  it('should allow activation if logs are enabled', () => {
    environment.logs_enabled = true; 

    const result = TestBed.runInInjectionContext(() => logsEnabledGuard(null as any, null as any));

    expect(result).toBe(true); 
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should block activation and navigate to /settings if logs are disabled', () => {
    environment.logs_enabled = false; 

    const result = TestBed.runInInjectionContext(() => logsEnabledGuard(null as any, null as any));

    expect(result).toBe(false); 
    expect(navigateSpy).toHaveBeenCalledWith(['/settings']); 
  });
});
