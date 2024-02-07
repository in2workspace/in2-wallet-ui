import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthenticationService } from './authentication.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { StorageService } from './storage.service';

describe('AuthenticationService', () => {
  let authenticationService: AuthenticationService;
  let oidcSecurityServiceSpy: jasmine.SpyObj<OidcSecurityService>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthenticationService', [true, '', ''])
    const oidcSecuritySpy = jasmine.createSpyObj('OidcSecurityService', ['checkAuth', 'authorizeWithPopUp', 'logoff']);
    const storageServiceSpyObj = jasmine.createSpyObj('StorageService', ['get', 'set', 'remove']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {provide: AuthenticationService, useValue: authServiceSpy},
        { provide: OidcSecurityService, useValue: oidcSecuritySpy },
        { provide: StorageService, useValue: storageServiceSpyObj },
      ],
    });

    authenticationService = TestBed.inject(AuthenticationService);
    oidcSecurityServiceSpy = TestBed.inject(OidcSecurityService) as jasmine.SpyObj<OidcSecurityService>;
    storageServiceSpy = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    
  });

  it('should be created', () => {
    expect(authenticationService).toBeTruthy();
  });
  /*
  it('should initialize with default values', () => {
    expect(authenticationService.isAuthenticated).toBeTruthy();
    expect(authenticationService.isAuthenticated.getValue()).toBe(false);
    expect(authenticationService.token).toBe('');
    expect(authenticationService.userData).toBeUndefined();
  });

  it('should set authentication status on checkAuth subscription', () => {
    const authData = { isAuthenticated: true, userData: {}, accessToken: 'fake-token' };
    oidcSecurityServiceSpy.checkAuth.and.returnValue(of(authData));

    authenticationService = new AuthenticationService(oidcSecurityServiceSpy);

    expect(authenticationService.isAuthenticated.getValue()).toBe(authData.isAuthenticated);
    expect(authenticationService.userData).toBe(authData.userData);
    expect(authenticationService.token).toBe(authData.accessToken);
  });

  it('should log in successfully', fakeAsync(() => {
    const authData = { isAuthenticated: true, userData: {}, accessToken: 'fake-token' };
    oidcSecurityServiceSpy.authorizeWithPopUp.and.returnValue(of(authData));

    authenticationService.login().subscribe(() => {
      expect(authenticationService.isAuthenticated.getValue()).toBe(authData.isAuthenticated);
      expect(authenticationService.userData).toBe(authData.userData);
      expect(authenticationService.token).toBe(authData.accessToken);
    });

    tick();
  }));

  it('should log out successfully', fakeAsync(() => {
    const logoffData = { accessToken: 'fake-token' };
    oidcSecurityServiceSpy.logoff.and.returnValue(of(logoffData));

    authenticationService.logout().subscribe((token) => {
      expect(token).toBe(logoffData.accessToken);
      expect(authenticationService.isAuthenticated.getValue()).toBe(true);
    });

    tick();
  }));

  it('should register user successfully', inject([HttpClientTestingModule], () => {
    const userData = { username: 'testuser', password: 'testpassword' };
    const expectedUrl = environment.registerParams.register_url + environment.walletUri.users_uri;
    
    authenticationService.register(userData).subscribe(() => {
      // Expect any additional logic you may have in your register method
      expect(true).toBeTruthy();
    });
  }));

  it('should get user name', () => {
    const expectedName = 'testuser';
    authenticationService.userData = { preferred_username: expectedName };

    const name = authenticationService.getName();

    expect(name).toBe(expectedName);
  });

  it('should check if user is authenticated', () => {
    const isAuthenticatedValue = true;
    const isAuthenticated$ = new BehaviorSubject<boolean>(isAuthenticatedValue);
    authenticationService.isAuthenticated = isAuthenticated$;

    authenticationService.isAuth().subscribe((value) => {
      expect(value).toBe(isAuthenticatedValue);
    });
  });
  */
});
