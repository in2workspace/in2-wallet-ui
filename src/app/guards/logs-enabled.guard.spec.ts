import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { logsEnabledGuard } from './logs-enabled.guard';

describe('logsEnabledGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => logsEnabledGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
