import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RegisterPage } from './register.page';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';

describe('RegisterPage', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;
  let authenticationServiceSpy: jasmine.SpyObj<AuthenticationService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(waitForAsync(() => {
    const authServiceSpyObj = jasmine.createSpyObj('AuthenticationService', ['register']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      //declarations: [RegisterPage],
      imports: [
        IonicModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: AuthenticationService, useValue: authServiceSpyObj },
        { provide: Router, useValue: routerSpyObj },
      ],
    }).compileComponents();

    authenticationServiceSpy = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  /*
  it('should handle email blur', () => {
    component.handleEmailBlur();
    expect(component.showEmailError).toBeTruthy();
  });

  it('should submit registration form successfully', () => {
    authenticationServiceSpy.register.and.returnValue(of({}));
    routerSpy.navigate.and.returnValue(Promise.resolve(true));

    component.login.setValue({ username: 'testuser', email: 'test@test.com', password: 'testpassword' });
    component.onSubmit();

    expect(authenticationServiceSpy.register).toHaveBeenCalledWith({ username: 'testuser', email: 'test@test.com', password: 'testpassword' });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login/'], {});
  });

  it('should handle registration error', () => {
    const errorMessage = 'Registration failed';
    authenticationServiceSpy.register.and.returnValue(throwError(errorMessage));

    component.login.setValue({ username: 'testuser', email: 'test@test.com', password: 'testpassword' });
    component.onSubmit();

    expect(authenticationServiceSpy.register).toHaveBeenCalledWith({ username: 'testuser', email: 'test@test.com', password: 'testpassword' });
    expect(component.error).toEqual('register.error');
  });*/
});





/*import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RegisterPage } from './register.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RegisterPage', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(RegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    })
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});*/
