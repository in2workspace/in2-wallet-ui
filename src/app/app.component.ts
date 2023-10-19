import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from './services/authentication.service';

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
    { title: 'Credentials', url: '/credentials', icon: 'wallet' },
    { title: 'Dids', url: '/dids', icon: 'key' },
    { title: 'Camera Selector', url: '/camera-selector', icon: 'camera' },
    { title: 'Language Selector', url: '/language-selector', icon: 'flag' },
    { title: 'Terms of User', url: '/terms-of-use', icon: 'document-text' },
    { title: 'Privacy Policy', url: '/privacy-policy', icon: 'book' },
    { title: 'FAQs', url: '/faqs', icon: 'help' },
    { title: 'Settings', url: '/settings', icon: 'cog' },
    { title: 'Logout', url:'/login', icon:'log-out'}
  ];

  showLanguageDropDown = false;

  toggleLanguageDropdown() {
    this.showLanguageDropDown = !this.showLanguageDropDown;
  }

  changeLanguage(language: string) {
    this.showLanguageDropDown = false;
  }
  constructor(public translate: TranslateService,
    private authenticationService:AuthenticationService,
    private router: Router,
    ) {
      translate.addLangs(['en']);
      translate.setDefaultLang('en');
    }
    logout(){
      this.authenticationService.logout();
      this.router.navigate(['/login'], {})
    }
}
