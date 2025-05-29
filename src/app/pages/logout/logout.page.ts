import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router, RouterModule } from '@angular/router';
import { IonicModule, PopoverController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

// todo This is not a logout page, it is menu component
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app.logout',
  templateUrl: './logout.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, TranslateModule],
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class LogoutPage {
  public constructor(
    private popOverController: PopoverController,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}
  public logout() {
    this.authenticationService.logout().subscribe(() => {
      this.router.navigate(['/home'], {});
    });
    this.popOverController.dismiss();
  }
}
