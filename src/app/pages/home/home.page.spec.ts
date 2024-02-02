import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, PopoverController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { HomePage } from './home.page';
import { WalletService } from 'src/app/services/wallet.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { LogoutPage } from '../logout/logout.page';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let routerSpy: jasmine.SpyObj<Router>;
  let walletServiceSpy: jasmine.SpyObj<WalletService>;
  let authServiceSpy: jasmine.SpyObj<AuthenticationService>;
  let popoverControllerSpy: jasmine.SpyObj<PopoverController>;
  let activatedRoute: any; // You might need to define a spy for ActivatedRoute if necessary

  beforeEach(waitForAsync(() => {
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const walletServiceSpyObj = jasmine.createSpyObj('WalletService', ['executeContent']);
    const authServiceSpyObj = jasmine.createSpyObj('AuthenticationService', ['getName', 'logout']);
    const popoverSpyObj = jasmine.createSpyObj('PopoverController', ['create', 'present']);

    TestBed.configureTestingModule({
      //declarations: [HomePage],
      imports: [IonicModule.forRoot(), FormsModule, TranslateModule.forRoot()],
      providers: [
        { provide: Router, useValue: routerSpyObj },
        { provide: WalletService, useValue: walletServiceSpyObj },
        { provide: AuthenticationService, useValue: authServiceSpyObj },
        { provide: PopoverController, useValue: popoverSpyObj },
        { provide: ActivatedRoute, useValue: { queryParams: of({}) } }, // Mock ActivatedRoute as needed
        TranslateService, // Add if needed
      ],
    }).compileComponents();

    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    walletServiceSpy = TestBed.inject(WalletService) as jasmine.SpyObj<WalletService>;
    authServiceSpy = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;
    popoverControllerSpy = TestBed.inject(PopoverController) as jasmine.SpyObj<PopoverController>;
    activatedRoute = TestBed.inject(ActivatedRoute);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Add more test cases based on your component's behavior

  // Example: Test the ngOnInit method
  /*
  it('should set userName from AuthenticationService on ngOnInit', () => {
    const userName = 'JohnDoe';
    authServiceSpy.getName.and.returnValue(userName);

    component.ngOnInit();

    expect(component.userName).toBe(userName);
  });


  it('should call AuthenticationService.logout and navigate to login page on logout', () => {
    const navigateSpy = routerSpy.navigate.and.returnValue(Promise.resolve(true));

    component.logout();

    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/login'], {});
  });

*/
});



/*import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HomePage } from './home.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { StsConfigLoader } from 'angular-auth-oidc-client';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
      ],
      providers: [StsConfigLoader]
    });
    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});*/
