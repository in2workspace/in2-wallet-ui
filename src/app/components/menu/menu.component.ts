import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router, RouterModule } from '@angular/router';
import { IonicModule, PopoverController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, TranslateModule],
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class MenuComponent {
  public constructor(
    private readonly popOverController: PopoverController,
    private readonly authenticationService: AuthenticationService,
  ) {}
  public logoutOnKeydown(event: KeyboardEvent): void{
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.logout();
    }
  }
  public logout(): void {
    this.authenticationService.logout$().subscribe();
    this.popOverController.dismiss();
  }
}
