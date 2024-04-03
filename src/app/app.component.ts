import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IonicModule, PopoverController } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from './services/authentication.service';
import { LogoutPage } from './pages/logout/logout.page';
import { StorageService } from './services/storage.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink, RouterLinkActive, CommonModule,TranslateModule ],
})
export class AppComponent implements OnInit{
    private authenticationService = inject(AuthenticationService);
    private router = inject(Router);
  userName:Observable<string> | undefined;

  constructor(public translate: TranslateService,
    private popoverController: PopoverController,
    private storageService:StorageService
    )  {
      translate.addLangs(['en','es','ca']);
      translate.setDefaultLang('en');
      this.storageService.get("language").then((res)=>{
        if(res)translate.setDefaultLang(res);
        else this.storageService.set("language","en")
      })
    }
  ngOnInit(): void {
    this.userName = this.authenticationService.getName();
 }
    logout(){
      this.authenticationService.logout().subscribe(() => {
        this.router.navigate(['/home'], {})

      });
    }

  async openPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: LogoutPage,
      event: ev,
      translucent: true,
      cssClass: 'custom-popover'
    });

    await popover.present();
  }
}
