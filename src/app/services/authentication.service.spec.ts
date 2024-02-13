import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthenticationService } from './authentication.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { StorageService } from './storage.service';

describe('AuthenticationService', () => {
  let authenticationService: AuthenticationService;

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

  });

  it('should be created', () => {
    expect(authenticationService).toBeTruthy();
  });


});
