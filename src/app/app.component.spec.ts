import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TranslateService } from '@ngx-translate/core';
import { PopoverController, IonicModule, NavController } from '@ionic/angular';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import {EMPTY, of } from 'rxjs';
import { AuthenticationService } from './services/authentication.service';
import { StorageService } from './services/storage.service';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '../environments/environment';
describe('AppComponent', () => {
  let component: AppComponent;
  let translateServiceMock: jest.Mocked<TranslateService>;
  let popoverControllerMock: jest.Mocked<PopoverController>;
  let routerMock: jest.Mocked<Router>;
  let authenticationServiceMock: jest.Mocked<AuthenticationService>;
  let storageServiceMock: jest.Mocked<StorageService>;

  const activatedRouteMock: Partial<ActivatedRoute> = {
    snapshot: {
      queryParams: { nocache: 'true' },
      url: [],
      params: {},
      fragment: null,
      data: {},
      outlet: '',
      component: null,
      routeConfig: null,
      root: null,
      parent: null,
      firstChild: null,
      children: [],
      pathFromRoot: [],
      paramMap: {
        keys: [],
        get: jest.fn(),
        has: jest.fn(),
        getAll: jest.fn(),
      },
      queryParamMap: {
        keys: ['nocache'],
        get: jest.fn((key) => (key === 'nocache' ? 'true' : null)),
        has: jest.fn((key) => key === 'nocache'),
        getAll: jest.fn(),
      },
    } as unknown as ActivatedRouteSnapshot,
  };

  const navControllerMock = {
    navigateForward: jest.fn(),
    navigateBack: jest.fn(),
    setDirection: jest.fn(),
  } as unknown as jest.Mocked<NavController>;

  beforeEach(async () => {
    translateServiceMock = {
      addLangs: jest.fn(),
      setDefaultLang: jest.fn(),
    } as unknown as jest.Mocked<TranslateService>;

    popoverControllerMock = {
      create: jest.fn().mockResolvedValue({
        present: jest.fn(),
      }),
    } as unknown as jest.Mocked<PopoverController>;

    routerMock = {
      navigate: jest.fn(),
      events: EMPTY, 
      url: '/callback?test=true',
    } as unknown as jest.Mocked<Router>;

    authenticationServiceMock = {
      getName: jest.fn().mockReturnValue(of('John Doe')),
      logout: jest.fn().mockReturnValue(of(null)),
    } as unknown as jest.Mocked<AuthenticationService>;

    storageServiceMock = {
      get: jest.fn().mockResolvedValue('en'),
      set: jest.fn(),
    } as unknown as jest.Mocked<StorageService>;

    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        IonicModule.forRoot(), 
        RouterTestingModule, 
      ],
      providers: [
        { provide: TranslateService, useValue: translateServiceMock },
        { provide: PopoverController, useValue: popoverControllerMock },
        { provide: Router, useValue: routerMock },
        { provide: AuthenticationService, useValue: authenticationServiceMock },
        { provide: StorageService, useValue: storageServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: NavController, useValue: navControllerMock },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app component', () => {
    expect(component).toBeTruthy();
  });

  it('should set CSS variables from environment in the constructor', () => {
    const cssVarMap = {
      '--primary-custom-color': environment.customizations.colors.primary,
      '--primary-contrast-custom-color': environment.customizations.colors.primary_contrast,
      '--secondary-custom-color': environment.customizations.colors.secondary,
      '--secondary-contrast-custom-color': environment.customizations.colors.secondary_contrast,
    };

    Object.entries(cssVarMap).forEach(([cssVariable, expectedValue]) => {
      const actualValue = document.documentElement.style.getPropertyValue(cssVariable);
      expect(actualValue).toBe(expectedValue);
    });
  });

  it('should set default language to "en" on initialization', async () => {
    await storageServiceMock.get('language');
    expect(translateServiceMock.setDefaultLang).toHaveBeenCalledWith('en');
  });

  it('should show an alert if the device is an iOS version lower than 14.3 and not using Safari', () => {
    const isIOSVersionLowerThanSpy = jest
      .spyOn(component['cameraService'], 'isIOSVersionLowerThan')
      .mockReturnValue(true);
    const isNotSafariSpy = jest
      .spyOn(component['cameraService'], 'isNotSafari')
      .mockReturnValue(true);
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {}); 

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    expect(isIOSVersionLowerThanSpy).toHaveBeenCalledWith(14.3);
    expect(isNotSafariSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith(
      'This application scanner is probably not supported on this device with this browser. If you have issues, use Safari browser.'
    );

    jest.restoreAllMocks();
  });

  it('should NOT show an alert if the device is an iOS version 14.3 or higher', () => {
    jest
      .spyOn(component['cameraService'], 'isIOSVersionLowerThan')
      .mockReturnValue(false);
    jest.spyOn(component['cameraService'], 'isNotSafari').mockReturnValue(true);
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {}); 

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    expect(alertSpy).not.toHaveBeenCalled();

    jest.restoreAllMocks();
  });

  it('should NOT show an alert if the browser is Safari', () => {
    jest
      .spyOn(component['cameraService'], 'isIOSVersionLowerThan')
      .mockReturnValue(true);
    jest.spyOn(component['cameraService'], 'isNotSafari').mockReturnValue(false);
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {}); 

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    expect(alertSpy).not.toHaveBeenCalled();

    jest.restoreAllMocks();
  });


  it('should initialize userName observable on ngOnInit', () => {
    component.ngOnInit();
    expect(authenticationServiceMock.getName).toHaveBeenCalled();
  });

  it('should redirect to a clean URL if "nocache=true" is in query params', () => {
    const originalLocation = window.location;
    delete (window as any).location;
    (window as any).location = {
      ...originalLocation,
      href: '',
      origin: 'http://example.com',
      search: '?nocache=true',
    };
    component.ngOnInit();
    expect(window.location.href).toContain('?nocache=');
    window.location = originalLocation;
  });

  it('should navigate to /home on logout', () => {
    component.logout();
    expect(authenticationServiceMock.logout).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/home'], {});
  });

  it('should open a popover on Enter or Space keydown', () => {
    const mockEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    jest.spyOn(component, 'openPopover').mockImplementation();

    component.handleKeydown(mockEvent);
    expect(component.openPopover).toHaveBeenCalledWith(mockEvent);
  });

  it('should show an alert if iOS version is below 14.3 and the browser is not Safari', () => {
    // Mock del servei CameraService
    const isIOSVersionLowerThanSpy = jest.spyOn(component['cameraService'], 'isIOSVersionLowerThan').mockReturnValue(true);
    const isNotSafariSpy = jest.spyOn(component['cameraService'], 'isNotSafari').mockReturnValue(true);

    // Espia la funció global alert
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    // Crear el component
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    expect(isIOSVersionLowerThanSpy).toHaveBeenCalled();
    expect(isNotSafariSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith(
      'This application scanner is probably not supported on this device with this browser. If you have issues, use Safari browser.'
    );

    // Restaurar espies
    isIOSVersionLowerThanSpy.mockRestore();
    isNotSafariSpy.mockRestore();
    alertSpy.mockRestore();
  });

  it('should NOT show an alert if iOS version is 14.3 or above', () => {
    const isIOSVersionLowerThanSpy = jest.spyOn(component['cameraService'], 'isIOSVersionLowerThan').mockReturnValue(false);
    const isNotSafariSpy = jest.spyOn(component['cameraService'], 'isNotSafari').mockReturnValue(true);
    
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    expect(isIOSVersionLowerThanSpy).toHaveBeenCalled();
    expect(isNotSafariSpy).toHaveBeenCalled();
    expect(alertSpy).not.toHaveBeenCalled();

    isIOSVersionLowerThanSpy.mockRestore();
    isNotSafariSpy.mockRestore();
    alertSpy.mockRestore();
  });

  it('should NOT show an alert if browser is Safari', () => {
    const isIOSVersionLowerThanSpy = jest.spyOn(component['cameraService'], 'isIOSVersionLowerThan').mockReturnValue(true);
    const isNotSafariSpy = jest.spyOn(component['cameraService'], 'isNotSafari').mockReturnValue(false);
    
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    expect(isIOSVersionLowerThanSpy).toHaveBeenCalled();
    expect(isNotSafariSpy).toHaveBeenCalled();
    expect(alertSpy).not.toHaveBeenCalled();

    isIOSVersionLowerThanSpy.mockRestore();
    isNotSafariSpy.mockRestore();
    alertSpy.mockRestore();
  });

  
});
