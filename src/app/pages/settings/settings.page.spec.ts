import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { SettingsPage } from './settings.page';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { LogoutPage } from '../logout/logout.page';
import { PopoverController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { AuthModule, OidcSecurityService } from 'angular-auth-oidc-client';
import { Storage } from '@ionic/storage-angular';

describe('SettingsPage', () => {
  let component: SettingsPage;
  let fixture: ComponentFixture<SettingsPage>;
  let authenticationService: AuthenticationService;
  let routerSpy: jasmine.SpyObj<Router>;
  let popoverControllerSpy: jasmine.SpyObj<PopoverController>;
  let oidcSecurityServiceSpy: jasmine.SpyObj<OidcSecurityService>;

  beforeEach(waitForAsync(() => {
    const authSpy = jasmine.createSpyObj('AuthenticationService', ['getName', 'Logout']);
    const oidcSecuritySpy = jasmine.createSpyObj('OidcSecurityService', ['checkAuth', 'authorizeWithPopUp', 'logoff']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const popoverSpyObj = jasmine.createSpyObj('PopoverController', ['create', 'present']);

    TestBed.configureTestingModule({
      //declarations: [SettingsPage],
      imports: [HttpClientTestingModule, IonicModule, CommonModule, FormsModule, TranslateModule.forRoot(), AuthModule.forRoot({config: {
        authority: environment.loginParams.login_url,
        redirectUrl: window.location.origin,
        postLogoutRedirectUri: window.location.origin,
        clientId: environment.loginParams.client_id,
        scope: environment.loginParams.scope,
        responseType: environment.loginParams.grant_type,
        silentRenew: true,
        useRefreshToken: true,
        ignoreNonceAfterRefresh: true,
        triggerRefreshWhenIdTokenExpired: false,
        autoUserInfo: false,
        //logLevel: LogLevel.Debug,
        secureRoutes:[environment.data_url,environment.wca_url]
      }})],
      providers: [
        { provide: AuthenticationService, useValue: authSpy },
        //AuthenticationService,
        OidcSecurityService,
        Storage,
        { provide: Router, useValue: routerSpyObj },
        { provide: PopoverController, useValue: popoverSpyObj },
        { provide: OidcSecurityService, useValue: oidcSecuritySpy },
      ],
    }).compileComponents();

    authenticationService = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    popoverControllerSpy = TestBed.inject(PopoverController) as jasmine.SpyObj<PopoverController>;
    oidcSecurityServiceSpy = TestBed.inject(OidcSecurityService) as jasmine.SpyObj<OidcSecurityService>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*
  it('should set userName from AuthenticationService on ngOnInit', () => {
    const userName = 'JohnDoe';
    authenticationServiceSpy.getName.and.returnValue(userName);

    component.ngOnInit();

    expect(component.userName).toBe(userName);
  });

  it('should call AuthenticationService.logout and navigate to login page on logout', () => {
    const navigateSpy = routerSpy.navigate.and.returnValue(Promise.resolve(true));

    component.logout();

    expect(authenticationServiceSpy.logout).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/login'], {});
  });

  it('should open popover on openPopover', async () => {
    const presentSpy = popoverControllerSpy.create.and.returnValue(Promise.resolve({ present: () => {} }));

    await component.openPopover({});

    expect(presentSpy).toHaveBeenCalled();
  });*/
});





/*import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SettingsPage } from './settings.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MockComponent } from 'ng-mocks';
import { StsConfigLoader } from 'angular-auth-oidc-client';

describe('SettingsPage', () => {
  let component: SettingsPage;
  let fixture: ComponentFixture<SettingsPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
      ],
      providers: []
    });
    fixture = TestBed.createComponent(SettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});*/
