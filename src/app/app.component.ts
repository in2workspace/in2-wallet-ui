import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink, RouterLinkActive, CommonModule],
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Wallet', url: '/wallet', icon: 'wallet' },
    { title: 'Camera Selector', url: '/camera-selector', icon: 'camera' },
    { title: 'Language Selector', url: '/language-selector', icon: 'flag' },
    { title: 'Terms of User', url: '/terms-of-use', icon: 'document-text' },
    { title: 'Privacy Policy', url: '/privacy-policy', icon: 'book' },
    { title: 'FAQs', url: '/faqs', icon: 'help' },
    { title: 'Settings', url: '/settings', icon: 'cog' },
  ];
  constructor(public translate: TranslateService
    ) {
      translate.addLangs(['en']);
      translate.setDefaultLang('en');
    }
}
