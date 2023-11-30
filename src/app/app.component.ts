import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from './services/authentication.service';
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink, RouterLinkActive, CommonModule,TranslateModule ],
})
export class AppComponent {
    private authenticationService = inject(AuthenticationService);
    private storageService = inject(StorageService);
    private router = inject(Router);
  public appPages = [
    { title: 'home', url: '/home', icon: 'home' },
    { title: 'credentials', url: '/credentials', icon: 'wallet' },
    { title: 'camera-selector', url: '/camera-selector', icon: 'camera' },
    { title: 'language-selector', url: '/language-selector', icon: 'flag' },
    { title: 'terms-of-user', url: '/terms-of-use', icon: 'document-text' },
    { title: 'privacy-policy', url: '/privacy-policy', icon: 'book' },
    { title: 'faqs', url: '/faqs', icon: 'help' },
    { title: 'settings', url: '/settings', icon: 'cog' },
    { title: 'logout', url:'/login', icon:'log-out'}
  ];

  showLanguageDropDown = false;

  toggleLanguageDropdown() {
    this.showLanguageDropDown = !this.showLanguageDropDown;
  }

  changeLanguage(language: string) {
    this.showLanguageDropDown = false;
  }
  constructor(public translate: TranslateService,
    ) {
      translate.addLangs(['en']);
      translate.setDefaultLang('en');
    }
    logout(){
      this.authenticationService.logout().subscribe(() => {
        this.router.navigate(['/login'], {})

      });
    }
}
