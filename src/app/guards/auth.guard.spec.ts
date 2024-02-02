import { TestBed, inject } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthenticationService } from '../services/authentication.service';
import { BehaviorSubject, of } from 'rxjs';

describe('AuthGuard', () => {
  let guard: typeof authGuard;
  let authServiceSpy: jasmine.SpyObj<AuthenticationService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceSpyObj = jasmine.createSpyObj('AuthenticationService', ['isAuth']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        authGuard,
        { provide: AuthenticationService, useValue: authServiceSpyObj },
        { provide: Router, useValue: routerSpyObj },
      ],
    });

    guard = TestBed.inject(authGuard);
    authServiceSpy = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  /*
  it('should return true if user is authenticated', () => {
    authServiceSpy.isAuthenticated = new BehaviorSubject<boolean>(true);

    const canActivate = guard.canActivate();

    expect(canActivate).toBe(true);
  });

  it('should return false and navigate to /login if user is not authenticated', () => {
    authServiceSpy.isAuthenticated = new BehaviorSubject<boolean>(false);
    authServiceSpy.isAuth.and.returnValue(of(false));

    const canActivate = guard.canActivate();

    expect(canActivate).toEqual(jasmine.any(Object)); // Check if it's an Observable
    canActivate.subscribe((result) => {
      expect(result).toBe(false);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login'], {});
    });
  });
  */
  // Add more test cases based on your guard's behavior
});



/*import { TestBed } from '@angular/core/testing';

import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let guard: typeof authGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        authGuard]
    });
    guard = TestBed.inject(authGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});*/
