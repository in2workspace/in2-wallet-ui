import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { routes } from './app.routes';
import { HttpClientModule } from '@angular/common/http';
import { AutoLoginPartialRoutesGuard } from 'angular-auth-oidc-client';
import { logsEnabledGuard } from './guards/logs-enabled.guard';
import { of } from 'rxjs';
import { StsConfigLoader } from 'angular-auth-oidc-client';

describe('App Routing', () => {
  let router: Router;

  // Mocks
  const mockStsConfigLoader = {
    getConfig: jest.fn().mockReturnValue(Promise.resolve({})),
  };

  const mockAutoLoginPartialRoutesGuard = {
    canActivate: jest.fn().mockReturnValue(of(true)),
  };

  const mockLogsEnabledGuard = {
    canActivate: jest.fn().mockReturnValue(of(true)),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes), HttpClientModule],
      providers: [
        { provide: StsConfigLoader, useValue: mockStsConfigLoader },
        { provide: AutoLoginPartialRoutesGuard, useValue: mockAutoLoginPartialRoutesGuard },
        { provide: logsEnabledGuard, useValue: mockLogsEnabledGuard },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
  });

  it('should redirect an empty path to /tabs/home', async () => {
    const navigation = await router.navigate(['']);
    expect(router.url).toBe('/tabs/home');
  });

  it('should lazy load tabs module for /tabs/home', async () => {
    const navigation = await router.navigate(['/tabs']);
    expect(router.url).toBe('/tabs/home');
  });

  it('should lazy load callback module for /callback', async () => {
    const navigation = await router.navigate(['/callback']);
    expect(router.url).toBe('/callback');
  });

  it('should redirect unknown routes to / then to /tabs/home', async () => {
    const navigation = await router.navigate(['/unknown-route']);
    expect(router.url).toBe('/tabs/home');
  });
});
