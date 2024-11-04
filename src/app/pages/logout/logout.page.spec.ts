import { TestBed } from '@angular/core/testing';
import { LogoutPage } from './logout.page';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { of } from 'rxjs';

describe('LogoutPage', () => {
  let component: LogoutPage;
  let authenticationServiceMock: any;
  let routerMock: any;
  let popoverControllerMock: any;

  beforeEach(async () => {
    authenticationServiceMock = {
      logout: jest.fn().mockReturnValue(of(null)), 
    };

    routerMock = {
      navigate: jest.fn(),
    };

    popoverControllerMock = {
      dismiss: jest.fn(),
    };

    await TestBed.configureTestingModule({
      providers: [
        LogoutPage,
        { provide: AuthenticationService, useValue: authenticationServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: PopoverController, useValue: popoverControllerMock },
      ],
    }).compileComponents();

    component = TestBed.inject(LogoutPage);
  });

  it('should call logout and navigate to credentials', () => {
    component.logout();

    expect(authenticationServiceMock.logout).toHaveBeenCalled(); 
    expect(routerMock.navigate).toHaveBeenCalledWith(['/tabs/credentials'], {});
    expect(popoverControllerMock.dismiss).toHaveBeenCalled(); 
  });
});
