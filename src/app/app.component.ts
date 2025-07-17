import { CommonModule, DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IonicModule, PopoverController } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from './services/authentication.service';
import { MenuComponent } from './components/menu/menu.component';
import { StorageService } from './services/storage.service';
import { Subject, takeUntil } from 'rxjs';
import { CameraService } from './services/camera.service';
import { environment } from 'src/environments/environment';
import { WebsocketService } from './services/websocket.service';

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

export class AppComponent implements OnInit, OnDestroy {
  private readonly authenticationService = inject(AuthenticationService);
  private readonly document = inject(DOCUMENT);
  private readonly websocket = inject(WebsocketService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router)
  public userName = this.authenticationService.getName$();
  public isCallbackRoute = false;
  public isBaseRoute = false;
  public readonly logoSrc = environment.customizations.logo_src;
  private readonly destroy$ = new Subject<void>();
  public isLoading = false;

  public constructor(
    private readonly cameraService: CameraService,
    private readonly popoverController: PopoverController,
    private readonly storageService: StorageService,
    public readonly translate: TranslateService
  ) {
    this.setDefaultLanguages();
    this.setStoredLanguage();
    this.setCustomStyles();
    this.setFavicon();
    this.router.events.subscribe(() => {
      this.isBaseRoute = this.router.url === '/';
    });
  }

  public ngOnInit() {
    // if the route is "/callback", don't allow menu popover --do declarative
    this.trackRouterEvents();
    this.alertIncompatibleDevice();
    this.websocket.isLoading$.subscribe((loading) => {
      this.isLoading = loading;
      this.cdr.detectChanges();
    });
  }

  public ngOnDestroy(){
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
    appleFaviconLink.rel = 'apple-touch-icon';
    appleFaviconLink.href = faviconUrl;
    
    this.document.head.appendChild(appleFaviconLink);
  }

  private setDefaultLanguages(): void{
    this.translate.addLangs(['en', 'es', 'ca']);
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }

  private setStoredLanguage(): void {
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
  private alertIncompatibleDevice(): void{
    const problematicIosVersion = this.cameraService.isIOSVersionLowerThan(14.3);
    const isNotSafari = this.cameraService.isNotSafari();
    if (problematicIosVersion && isNotSafari) {
      alert('This application scanner is probably not supported on this device with this browser. If you have issues, use Safari browser.');
    }
  }
  
  private trackRouterEvents(): void {
    this.router.events
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => {
      const currentUrl = this.router.url.split('?')[0];
      this.isCallbackRoute = currentUrl.startsWith('/callback');
    });
  }

  public openPopoverByKeydown(event: KeyboardEvent): void {
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
      component: MenuComponent,
      event: ev,
      translucent: true,
      cssClass: 'custom-popover',
    });

    await popover.present();
  }

}