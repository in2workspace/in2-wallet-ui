import { TestBed } from '@angular/core/testing';
import { AuthenticationService } from './authentication.service';
import { EventTypes, OidcSecurityService, PublicEventsService } from 'angular-auth-oidc-client';
import { of, Subject } from 'rxjs';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let oidcSecurityService: jest.Mocked<any>;
  let mockEvents$: Subject<any>;
  let publicEventsService: jest.Mocked<Partial<PublicEventsService>>;

  beforeEach(() => {
    mockEvents$ = new Subject();

    publicEventsService = {
      registerForEvents: jest.fn(() => mockEvents$.asObservable())
    };

    oidcSecurityService = {
      checkAuth: jest.fn(),
      authorizeWithPopUp: jest.fn(),
      logoffAndRevokeTokens: jest.fn()
    };

    oidcSecurityService.checkAuth.mockReturnValue(of({
      isAuthenticated: true,
      userData: { name: 'John Doe' },
      accessToken: 'dummy-token',
      idToken: 'dummy-id-token'
    }));

    TestBed.configureTestingModule({
      providers: [
        AuthenticationService,
        { provide: OidcSecurityService, useValue: oidcSecurityService },
        { provide: PublicEventsService, useValue: publicEventsService }
      ]
    });

    service = TestBed.inject(AuthenticationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('checkAuth should complete without errors', (done) => {
    oidcSecurityService.checkAuth.mockReturnValue(of({
      isAuthenticated: true,
      userData: {},
      accessToken: '',
      idToken: ''
    }));

    service.checkAuth().subscribe({
      next: () => {},
      error: () => {
        fail('checkAuth should not have failed');
      },
      complete: () => done()
    });
  });

  it('logout should call oidcSecurityService.logoffAndRevokeTokens', () => {
    service.logout();
    expect(oidcSecurityService.logoffAndRevokeTokens).toHaveBeenCalled();
  });

  it('should call logout when TokenExpired event is emitted', () => {
  const logoutSpy = jest.spyOn(service, 'logout');

  mockEvents$.next({ type: EventTypes.TokenExpired });

  expect(logoutSpy).toHaveBeenCalled();
});

it('should call logout when IdTokenExpired event is emitted', () => {
  const logoutSpy = jest.spyOn(service, 'logout');

  mockEvents$.next({ type: EventTypes.IdTokenExpired });

  expect(logoutSpy).toHaveBeenCalled();
});

it('should log a warning when SilentRenewFailed is emitted', () => {
  const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

  mockEvents$.next({ type: EventTypes.SilentRenewFailed });

  expect(consoleWarnSpy).toHaveBeenCalledWith('Silent renew failed:', { type: EventTypes.SilentRenewFailed });

  consoleWarnSpy.mockRestore();
});

});
