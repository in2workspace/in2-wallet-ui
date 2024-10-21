import { TestBed } from '@angular/core/testing';
import { AuthenticationService } from './authentication.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { of } from 'rxjs';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let oidcSecurityService: jest.Mocked<any>;

  beforeEach(() => {
    oidcSecurityService = {
      checkAuth: jest.fn(),
      authorizeWithPopUp: jest.fn(),
      logoff: jest.fn()
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
        { provide: OidcSecurityService, useValue: oidcSecurityService }
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

  it('logout should call oidcSecurityService.logoff', () => {
    service.logout();
    expect(oidcSecurityService.logoff).toHaveBeenCalled();
  });
});
