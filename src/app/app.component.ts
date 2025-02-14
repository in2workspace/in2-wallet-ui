import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IonicModule, PopoverController } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from './services/authentication.service';
import { LogoutPage } from './pages/logout/logout.page';
import { StorageService } from './services/storage.service';
import { Observable } from 'rxjs';
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
  private readonly router = inject(Router)
  public userName: Observable<string> | undefined;
  public isCallbackRoute = false;
  public readonly logoSrc=environment.customizations.logo_src;

  public constructor(
    private readonly cameraService: CameraService,
    public readonly translate: TranslateService,
    private readonly popoverController: PopoverController,
    private readonly storageService: StorageService
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


    //alert for IOs below 14.3
    const problematicIosVersion = this.cameraService.isIOSVersionLowerThan(14.3);
    const isNotSafari = this.cameraService.isNotSafari();
    if (problematicIosVersion && isNotSafari) {
      alert('This application scanner is probably not supported on this device with this browser. If you have issues, use Safari browser.');
    }
  }

  public async ngOnInit(): Promise<void> {
    this.userName = this.authenticationService.getName();

    await this.setLanguage();

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

  public async setLanguage(){
    this.translate.addLangs(['en', 'es', 'ca']);
    this.translate.setDefaultLang('en');
    this.storageService.get('language').then((res:string) => {
      if (res) this.translate.setDefaultLang(res);
      else this.storageService.set('language', 'en');
    });
  }

}
