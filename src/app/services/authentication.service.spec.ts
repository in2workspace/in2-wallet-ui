import { TestBed } from '@angular/core/testing';
import { AuthenticationService } from './authentication.service';
import { EventTypes, OidcSecurityService, PublicEventsService } from 'angular-auth-oidc-client';
import { of, Subject, throwError } from 'rxjs';

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

    oidcSecurityService.logoffAndRevokeTokens.mockReturnValue(of(undefined));

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

  it('should call checkAuth$ and update userData and token', (done) => {
    service.checkAuth$().subscribe((res) => {
      expect(res.isAuthenticated).toBe(true);
      expect(service.getToken()).toBe('dummy-token');

      service.getName$().subscribe(name => {
        expect(name).toBe('John Doe');
        done();
      });
    });
  });

  it('should return current name through getName$', (done) => {
    service['name'].next('Alice');
    service.getName$().subscribe(name => {
      expect(name).toBe('Alice');
      done();
    });
  });

  it('should return current token via getToken', () => {
    service['token'] = 'test-token';
    expect(service.getToken()).toBe('test-token');
  });

  it('should call logoffAndRevokeTokens on logout$', (done) => {
    const postMessageSpy = jest.spyOn(service['bc'], 'postMessage');

    service.logout$().subscribe(() => {
      expect(oidcSecurityService.logoffAndRevokeTokens).toHaveBeenCalled();
      expect(postMessageSpy).toHaveBeenCalledWith('forceWalletLogout');
      done();
    });
  });

  it('should handle errors during logout$', (done) => {
    const error = new Error('logout failed');
    oidcSecurityService.logoffAndRevokeTokens.mockReturnValueOnce(throwError(() => error));

    service.logout$().subscribe({
      error: (err) => {
        expect(err).toBe(error);
        done();
      }
    });
  });

  it('should handle SilentRenewFailed event when offline and reauthenticate when back online', (done) => {
    // Prepare to emit SilentRenewFailed
    Object.defineProperty(navigator, 'onLine', { value: false, configurable: true });

    const checkAuthSpy = jest.spyOn(service, 'checkAuth$').mockReturnValue(of({
      isAuthenticated: true,
      userData: { name: 'Recovered' },
      accessToken: 'recovered-token',
      idToken: ''
    }));

    mockEvents$.next({ type: EventTypes.SilentRenewFailed });

    // Simulate going online
    Object.defineProperty(navigator, 'onLine', { value: true });
    window.dispatchEvent(new Event('online'));

    // Espera que s'hagi cridat checkAuth$ de nou
    setTimeout(() => {
      expect(checkAuthSpy).toHaveBeenCalled();
      done();
    }, 50);
  });

  it('should logout if SilentRenewFailed while online', (done) => {
    const logoutSpy = jest.spyOn(service, 'logout$').mockReturnValue(of(undefined));

    Object.defineProperty(navigator, 'onLine', { value: true, configurable: true });

    mockEvents$.next({ type: EventTypes.SilentRenewFailed });

    setTimeout(() => {
      expect(logoutSpy).toHaveBeenCalled();
      done();
    }, 50);
  });

  it('should logout on TokenExpired or IdTokenExpired', (done) => {
    const logoutSpy = jest.spyOn(service, 'logout$').mockReturnValue(of(undefined));

    mockEvents$.next({ type: EventTypes.TokenExpired });
    mockEvents$.next({ type: EventTypes.IdTokenExpired });

    setTimeout(() => {
      expect(logoutSpy).toHaveBeenCalledTimes(2);
      done();
    }, 50);
  });

  // it('should handle BroadcastChannel logout messages', () => {
  //   const localLogoutSpy = jest.spyOn<any>(service, 'localLogout').mockImplementation(() => {});

  //   service['bc'].onmessage!({ data: 'forceWalletLogout' } as MessageEvent);
  //   expect(localLogoutSpy).toHaveBeenCalled();
  // });
});
