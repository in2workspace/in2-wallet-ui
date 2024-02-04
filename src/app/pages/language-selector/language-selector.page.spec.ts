import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { LanguageSelectorPage } from './language-selector.page';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { LogoutPage } from '../logout/logout.page';
import { PopoverController } from '@ionic/angular';

describe('LanguageSelectorPage', () => {
  let component: LanguageSelectorPage;
  let fixture: ComponentFixture<LanguageSelectorPage>;
  let translateServiceSpy: jasmine.SpyObj<TranslateService>;
  let authenticationServiceSpy: jasmine.SpyObj<AuthenticationService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let popoverControllerSpy: jasmine.SpyObj<PopoverController>;

  beforeEach(waitForAsync(() => {
    const translateSpy = jasmine.createSpyObj('TranslateService', ['use', 'currentLang']);
    const authSpy = jasmine.createSpyObj('AuthenticationService', ['getName', 'logout']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const popoverSpyObj = jasmine.createSpyObj('PopoverController', ['create', 'present']);

    TestBed.configureTestingModule({
      //declarations: [LanguageSelectorPage],
      imports: [IonicModule, CommonModule, FormsModule, TranslateModule.forRoot(), LanguageSelectorPage],
      providers: [
        { provide: TranslateService, useValue: translateSpy },
        { provide: AuthenticationService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: PopoverController, useValue: popoverSpyObj },
      ],
    }).compileComponents();

    translateServiceSpy = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
    authenticationServiceSpy = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    popoverControllerSpy = TestBed.inject(PopoverController) as jasmine.SpyObj<PopoverController>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageSelectorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*
  it('should set selected language and username on ngOnInit', () => {
    const lang = 'es';
    const username = 'testuser';

    translateServiceSpy.currentLang = lang;
    authenticationServiceSpy.getName.and.returnValue(username);

    component.ngOnInit();

    expect(component.selected).toEqual(lang);
    expect(component.userName).toEqual(username);
  });

  it('should change language on languageChange', () => {
    const code = 'en';

    component.languageChange(code);

    expect(translateServiceSpy.use).toHaveBeenCalledWith(code);
    expect(component.selected).toEqual(code);
  });

  it('should logout and navigate to login on logout', () => {
    authenticationServiceSpy.logout.and.returnValue(of({}));
    
    component.logout();

    expect(authenticationServiceSpy.logout).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login'], {});
  });

  it('should open popover on openPopover', async () => {
    const popover = jasmine.createSpyObj('popover', ['present']);
    popoverControllerSpy.create.and.returnValue(Promise.resolve(popover));

    const ev = { /* some event object */ //};

   /* await component.openPopover(ev);

    expect(popoverControllerSpy.create).toHaveBeenCalledWith({
      component: LogoutPage,
      event: ev,
      translucent: true,
      cssClass: 'custom-popover'
    });
    expect(popover.present).toHaveBeenCalled();
  });*/
});




/*import { ComponentFixture, TestBed, async, waitForAsync } from '@angular/core/testing';
import { LanguageSelectorPage } from './language-selector.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LanguageSelectorPage', () => {
  let component: LanguageSelectorPage;
  let fixture: ComponentFixture<LanguageSelectorPage>;

  beforeEach(async(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LanguageSelectorPage,
        HttpClientTestingModule
      ],
    })
    fixture = TestBed.createComponent(LanguageSelectorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});*/
