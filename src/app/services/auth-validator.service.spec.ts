import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AuthValidatorService } from './auth-validator.service';

describe('AuthValidatorService', () => {
  let service: AuthValidatorService;
  let mockRouter: jest.Mocked<Router>;
  let mockActivatedRoute: Partial<ActivatedRoute>;

  beforeEach(() => {
    mockRouter = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    mockActivatedRoute = {
      snapshot: {
        queryParamMap: {
          get: jest.fn().mockImplementation((param: string) => {
            const params: { [key: string]: string; } = {
              state: 'validState',
            };
            return params[param] || null;
          }),
          has: jest.fn().mockReturnValue(true),
          getAll: jest.fn().mockReturnValue([]),
          keys: []
        },
        url: [],
        params: {},
        queryParams: {},
        fragment: null,
        data: {},
        outlet: 'primary',
        component: null,
        routeConfig: null,
        root: {} as ActivatedRouteSnapshot,
        parent: null,
        firstChild: null,
        children: [],
        pathFromRoot: [],
        paramMap: {
          get: jest.fn(),
          has: jest.fn(),
          getAll: jest.fn(),
          keys: []
        },
        title: undefined
      },
    };

    TestBed.configureTestingModule({
      providers: [
        AuthValidatorService,
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    });

    service = TestBed.inject(AuthValidatorService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should redirect to base URL if 0-auth-client is missing in storage', async () => {
    localStorage.removeItem('0-auth-client');

    await service.validateAuthParams();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/tabs/home']);
  });

  it('should redirect to base URL if state does not match', async () => {
    localStorage.setItem(
      '0-auth-client',
      JSON.stringify({
        authStateControl: 'differentState',
      })
    );

    await service.validateAuthParams();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/tabs/home']);
  });

  it('should not redirect if state matches', async () => {
    localStorage.setItem(
      '0-auth-client',
      JSON.stringify({
        authStateControl: 'validState',
      })
    );

    await service.validateAuthParams(); 

    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
