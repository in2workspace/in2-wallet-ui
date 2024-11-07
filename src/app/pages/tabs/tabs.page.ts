import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { CredentialsPage } from '../credentials/credentials.page';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TranslateModule,
    RouterModule,
  ],
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class TabsPage {

  constructor(private navCtrl: NavController, private router: Router) {}

  async navigateToTab(tab: string) {
    if (tab === 'credentials') {
      await this.navCtrl.navigateRoot('/callback');

      this.navCtrl.navigateRoot('/tabs/credentials');

    } else if (tab === 'settings') {
      this.navCtrl.navigateRoot('/tabs/settings');
    }
  }

  redirectTo(uri: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([uri])});
  }
}
