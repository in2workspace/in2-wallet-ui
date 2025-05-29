import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TranslateService } from '@ngx-translate/core';
import { PopoverController, IonicModule, NavController } from '@ionic/angular';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { of, Subject } from 'rxjs';
import { AuthenticationService } from './services/authentication.service';
import { StorageService } from './services/storage.service';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '../environments/environment';
import { WebsocketService } from './services/websocket.service';
import { ChangeDetectorRef } from '@angular/core';
describe('AppComponent', () => {
  let component: AppComponent;
  let translateServiceMock: jest.Mocked<TranslateService>;
  let popoverControllerMock: jest.Mocked<PopoverController>;
  let routerMock: jest.Mocked<Router>;
  let authenticationServiceMock: jest.Mocked<AuthenticationService>;
  let storageServiceMock: jest.Mocked<StorageService>;
  let routerEventsSubject = new Subject<Event>();
  let websocketServiceMock: Partial<WebsocketService>;
  let isLoadingSubject: Subject<boolean>;

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
    isLoadingSubject = new Subject<boolean>();
    websocketServiceMock = {
      isLoading$: isLoadingSubject.asObservable(),
    };

    translateServiceMock = {
      addLangs: jest.fn(),
      getLangs: jest.fn(),
      setDefaultLang: jest.fn(),
      use: jest.fn()
    } as unknown as jest.Mocked<TranslateService>;

    popoverControllerMock = {
      create: jest.fn().mockResolvedValue({
        present: jest.fn(),
      }),
    } as unknown as jest.Mocked<PopoverController>;

    routerMock = {
      navigate: jest.fn(),
      events: routerEventsSubject, 
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
        { provide: WebsocketService, useValue: websocketServiceMock }
      ],
    }).compileComponents();

    jest.spyOn(AppComponent.prototype, 'setDefaultLanguages');
    jest.spyOn(AppComponent.prototype, 'setStoredLanguage');
    jest.spyOn(AppComponent.prototype, 'setCustomStyles');

    const fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

  });

  it('should create the app component', () => {
    expect(component).toBeTruthy();
  });

  it('should initiliaze default languages, stored language and custom styles', ()=>{
    expect(component.setDefaultLanguages).toHaveBeenCalled();
    expect(component.setStoredLanguage).toHaveBeenCalled();
    expect(component.setCustomStyles).toHaveBeenCalled();
  });

  it('should track router events, handle no cache and show alert for incompatible device', ()=>{
    jest.spyOn(component, 'trackRouterEvents');
    jest.spyOn(component, 'alertIncompatibleDevice');

    component.ngOnInit();

    expect(component.trackRouterEvents).toHaveBeenCalled();
    expect(component.alertIncompatibleDevice).toHaveBeenCalled();
  });

  it('should emit and complete destroy subject', ()=>{
    const nextSpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');

    component['ngOnDestroy']();

    expect(nextSpy).toHaveBeenCalledTimes(1);
    expect(completeSpy).toHaveBeenCalledTimes(1);
  });

  it('should add available languages', () => {
    component.setDefaultLanguages();
    expect(translateServiceMock.addLangs).toHaveBeenCalledWith(['en', 'es', 'ca']);
    expect(translateServiceMock.setDefaultLang).toHaveBeenCalledWith('en');
    expect(translateServiceMock.use).toHaveBeenCalledWith('en');
  });

  it('should set default language to "en" if no stored language is found', fakeAsync(() => {
    translateServiceMock.use.mockClear();
    storageServiceMock.get.mockResolvedValueOnce('');
    translateServiceMock.getLangs.mockReturnValue(['en', 'es', 'ca']);
    component.setStoredLanguage();
    tick();
    expect(translateServiceMock.use).not.toHaveBeenCalled();
    expect(storageServiceMock.set).toHaveBeenCalledWith('language', 'en');
  }));

  it('should set stored language if it is in the supported languages', fakeAsync(() => {
    translateServiceMock.use.mockClear();
    storageServiceMock.get.mockResolvedValueOnce('ca');
    translateServiceMock.getLangs.mockReturnValue(['en', 'es', 'ca']);
    component.setStoredLanguage();
    tick();
    expect(translateServiceMock.use).toHaveBeenCalledWith('ca');
    expect(storageServiceMock.set).not.toHaveBeenCalled();
  }));
  
  it('should not use stored language if it is not in the supported languages', fakeAsync(() => {
    translateServiceMock.use.mockClear();
    storageServiceMock.get.mockResolvedValueOnce('fr');
    translateServiceMock.getLangs.mockReturnValue(['en', 'es', 'ca']);
    component.setStoredLanguage();
    tick();
    expect(translateServiceMock.use).not.toHaveBeenCalled();
    expect(storageServiceMock.set).toHaveBeenCalledWith('language', 'en');
  }));

  it('should set CSS variables from environment in the constructor', () => {
    component.setCustomStyles();
    
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


  it('should show an alert if the device is an iOS version lower than 14.3 and not using Safari', () => {
    const isIOSVersionLowerThanSpy = jest
      .spyOn(component['cameraService'], 'isIOSVersionLowerThan')
      .mockReturnValue(true);
    const isNotSafariSpy = jest
      .spyOn(component['cameraService'], 'isNotSafari')
      .mockReturnValue(true);
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {}); 
  
    component.alertIncompatibleDevice(); // Crida explícita a la funció
  
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
  
    component.alertIncompatibleDevice(); // Crida explícita a la funció
  
    expect(alertSpy).not.toHaveBeenCalled();
  
    jest.restoreAllMocks();
  });
  
  it('should NOT show an alert if the browser is Safari', () => {
    jest
      .spyOn(component['cameraService'], 'isIOSVersionLowerThan')
      .mockReturnValue(true);
    jest.spyOn(component['cameraService'], 'isNotSafari').mockReturnValue(false);
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {}); 
  
    component.alertIncompatibleDevice(); // Crida explícita a la funció
  
    expect(alertSpy).not.toHaveBeenCalled();
  
    jest.restoreAllMocks();
  });

  it('should navigate to /home on logout', () => {
    component.logout();
    expect(authenticationServiceMock.logout).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/home'], {});
  });

  it('should open a popover on Enter or Space keydown', () => {
    const mockEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    jest.spyOn(component, 'openPopover').mockImplementation();

    component.openPopoverByKeydown(mockEvent);
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
    
  it('should subscribe to isLoading$ and update isLoading', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const spyDetectChanges = jest.spyOn(component['cdr'], 'detectChanges');

    component.ngOnInit(); 

    isLoadingSubject.next(true); 
    fixture.detectChanges(); 

    expect(component.isLoading).toBe(true);
    expect(spyDetectChanges).toHaveBeenCalled();
  });

  it('should not show overlay if isLoading is false', () => {
    const fixture = TestBed.createComponent(AppComponent);
    component.ngOnInit();
    isLoadingSubject.next(false); 
    fixture.detectChanges();

    expect(component.isLoading).toBe(false);
  });

  it('should update isLoading when WebSocketService emits a new value', () => {
    const fixture = TestBed.createComponent(AppComponent);
    component.ngOnInit();

    isLoadingSubject.next(false);
    fixture.detectChanges();
    expect(component.isLoading).toBe(false);

    isLoadingSubject.next(true);
    fixture.detectChanges();
    expect(component.isLoading).toBe(true);

    isLoadingSubject.next(false);
    fixture.detectChanges();
    expect(component.isLoading).toBe(false);
  });
 
  it('should render the overlay when isLoading is true', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    component.isLoading = true; 
    fixture.detectChanges(); 
    await fixture.whenStable(); 

    setTimeout(() => {
      fixture.detectChanges(); 
      const overlayElement = fixture.nativeElement.querySelector('.overlay');

      expect(overlayElement).not.toBeNull(); 
      expect(getComputedStyle(overlayElement).display).not.toBe('none');
    }, 0);
  });

  it('should not render the overlay when isLoading is false', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    component.isLoading = false; 
    fixture.detectChanges();
    await fixture.whenStable();

    setTimeout(() => {
      fixture.detectChanges();
      const overlayElement = fixture.nativeElement.querySelector('.overlay');
      expect(overlayElement).toBeNull(); 
    }, 0);
  });
});

