import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IonicModule, PopoverController } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from './services/authentication.service';
import { LogoutPage } from './pages/logout/logout.page';
import { StorageService } from './services/storage.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    TranslateModule,
  ],
})

export class AppComponent implements OnInit {
  public userName: Observable<string> | undefined;
  private authenticationService = inject(AuthenticationService);
  private router = inject(Router)
  public isCallbackRoute = false;;

  public constructor(
    public translate: TranslateService,
    private popoverController: PopoverController,
    private storageService: StorageService
  ) {
    const root = document.documentElement;

    const cssVarMap = {
      '--primary-custom-color': environment.customizations.colors.primary,
      '--primary-contrast-custom-color': environment.customizations.colors.primary_contrast,
      '--secondary-custom-color': environment.customizations.colors.secondary,
      '--secondary-contrast-custom-color': environment.customizations.colors.secondary_contrast,
    };
  
    Object.entries(cssVarMap).forEach(([cssVariable, colorValue]) => {
      root.style.setProperty(cssVariable, colorValue);
    });

    translate.addLangs(['en', 'es', 'ca']);
    translate.setDefaultLang('en');
    this.storageService.get('language').then((res:string) => {
      if (res) translate.setDefaultLang(res);
      else this.storageService.set('language', 'en');
    });
  }

  public ngOnInit(): void {
    this.userName = this.authenticationService.getName();

    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get('nocache') === 'true') {
      const cleanUrl = `${window.location.origin}?nocache=${Date.now()}`;
      window.location.href = cleanUrl;
    }
    this.router.events.subscribe(() => {
      const currentUrl = this.router.url.split('?')[0];
      this.isCallbackRoute = currentUrl.startsWith('/callback');
    });
  }

  public logout() {
    this.authenticationService.logout().subscribe(() => {
      this.router.navigate(['/home'], {});
    });
  }


  public handleKeydown(event: KeyboardEvent, action = 'request') {
    if (event.key === 'Enter' || event.key === ' ') {
        this.openPopover(event);

      event.preventDefault();
    }
  }

  public async openPopover(ev: Event) {
    if (this.isCallbackRoute) {
      return; 
    }
    const popover = await this.popoverController.create({
      component: LogoutPage,
      event: ev,
      translucent: true,
      cssClass: 'custom-popover',
    });

    await popover.present();
  }

}
