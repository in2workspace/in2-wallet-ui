import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IonicModule, PopoverController } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from './services/authentication.service';
import { LogoutPage } from './pages/logout/logout.page';
import { StorageService } from './services/storage.service';
import { Subject, take, takeUntil } from 'rxjs';
import { CameraService } from './services/camera.service';
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
  private readonly authenticationService = inject(AuthenticationService);
  private document = inject(DOCUMENT);
  private readonly router = inject(Router);
  
  public userName = this.authenticationService.getName();
  public isCallbackRoute = false;
  public readonly logoSrc = environment.customizations.logo_src;
  private readonly destroy$ = new Subject<void>();

  public constructor(
    private readonly cameraService: CameraService,
    private readonly popoverController: PopoverController,
    private readonly storageService: StorageService,
    public readonly translate: TranslateService,
  ) {
    this.setDefaultLanguages();
    this.setStoredLanguage();

    this.setCustomStyles();
  }

  public ngOnInit() {
    this.setFavicon();
    this.handleNoCache();
    this.trackRouterEvents();
    this.alertIncompatibleDevice();
  }

  private ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }

  public setCustomStyles(): void{
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
  }

  public setDefaultLanguages(): void{
    this.translate.addLangs(['en', 'es', 'ca']);
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }

  public setStoredLanguage(): void {
    this.storageService.get('language').then((res: string) => {
      const availableLangs = this.translate.getLangs();
      
      if (availableLangs.includes(res)) {
        this.translate.use(res);
      } else {
        this.storageService.set('language', 'en');
      }
    });
  }

  //alert for IOs below 14.3
  public alertIncompatibleDevice(): void{
    const problematicIosVersion = this.cameraService.isIOSVersionLowerThan(14.3);
    const isNotSafari = this.cameraService.isNotSafari();
    if (problematicIosVersion && isNotSafari) {
      alert('This application scanner is probably not supported on this device with this browser. If you have issues, use Safari browser.');
    }
  }

  public handleNoCache(): void {
    const urlParams = new URLSearchParams(window.location.search);
  
    if (urlParams.get('nocache') === 'true') {
      const cleanUrl = `${window.location.origin}?nocache=${Date.now()}`;
      window.location.href = cleanUrl;
    }
  }
  
  public trackRouterEvents(): void {
    this.router.events
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => {
      const currentUrl = this.router.url.split('?')[0];
      this.isCallbackRoute = currentUrl.startsWith('/callback');
    });
  }

  private setFavicon(): void {
    const faviconUrl = environment.customizations.favicon_src;

    // load favicon from environment
    let faviconLink: HTMLLinkElement = this.document.querySelector("link[rel='icon']") || this.document.createElement('link');
    faviconLink.type = 'image/x-icon';
    faviconLink.rel = 'icon';
    faviconLink.href = faviconUrl;
    
    this.document.head.appendChild(faviconLink);

    // load apple-touch icon from environment
    let appleFaviconLink: HTMLLinkElement = this.document.querySelector("link[rel='apple-touch-icon']") || this.document.createElement('link');
    appleFaviconLink.type = 'image/x-icon';
    appleFaviconLink.rel = 'icon';
    appleFaviconLink.href = faviconUrl;
    
    this.document.head.appendChild(appleFaviconLink);
  }

  public logout(): void {
    this.authenticationService.logout()
    .pipe(take(1))
    .subscribe(() => {
      this.router.navigate(['/home'], {});
    });
  }


  public handleKeydown(event: KeyboardEvent, action = 'request'): void {
    if (event.key === 'Enter' || event.key === ' ') {
        this.openPopover(event);

      event.preventDefault();
    }
  }

  public async openPopover(ev: Event): Promise<void> {
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
