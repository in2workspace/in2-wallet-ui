import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MenuComponent } from './menu.component';
import { IonicModule, PopoverController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let popoverController = 
    {
      dismiss: jest.fn(() => Promise.resolve())
    }

  const mockAuthenticationService = {
    logout: jest.fn(() => of(undefined)),
  };

  const mockRouter = {
    navigate: jest.fn(),
  };

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [MenuComponent, IonicModule.forRoot(), TranslateModule.forRoot() ],
      providers: [
        { provide: AuthenticationService, useValue: mockAuthenticationService },
        { provide: Router, useValue: mockRouter },
      ],
    })
    .overrideProvider(PopoverController, { useValue: popoverController })
    .compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    console.log(component['popOverController']);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('logoutOnKeydown', () => {
    it('should call logout on Enter key press', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      jest.spyOn(event, 'preventDefault');

      const logoutSpy = jest.spyOn(component, 'logout');

      component.logoutOnKeydown(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(logoutSpy).toHaveBeenCalled();
    });

    it('should call logout on Space key press', () => {
      const event = new KeyboardEvent('keydown', { key: ' ' });
      jest.spyOn(event, 'preventDefault');

      const logoutSpy = jest.spyOn(component, 'logout');

      component.logoutOnKeydown(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(logoutSpy).toHaveBeenCalled();
    });

    it('should not call logout on other key presses', () => {
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      jest.spyOn(event, 'preventDefault');

      const logoutSpy = jest.spyOn(component, 'logout');

      component.logoutOnKeydown(event);

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(logoutSpy).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should call authenticationService.logout, navigate and dismiss popover', fakeAsync(() => {
      const popoverSpy = jest.spyOn(component['popOverController'], 'dismiss');
      component.logout();
      tick();

      expect(mockAuthenticationService.logout).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/home'], {});
      tick();

      expect(popoverSpy).toHaveBeenCalled();
    }));

  });
});
