import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, PopoverController } from '@ionic/angular';
import { TranslateModule,TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import {LogoutPage } from '../logout/logout.page';
import { Router} from '@angular/router';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,TranslateModule]
})
export class LanguageSelectorPage implements OnInit {
  public translate= inject(TranslateService);
  selected : string = '';
  userName: string = '';

  languageList = [
    {
      name: "English",
      url: "assets/flags/uk.png",
      code: "en"
    },
    {
      name: "Castellano",
      url: "assets/flags/es.png",
      code: "es"
    },
    {
      name: "Català",
      url: "assets/flags/ca.png",
      code: "ca"
    },
    {
      name: "Italian",
      url: "assets/flags/it.png",
      code: "it"
    },
    {
      name: "French",
      url: "assets/flags/fr.png",
      code: "fr"
    },
    {
      name: "German",
      url: "assets/flags/de.png",
      code: "de"
    },

  ]
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private popoverController: PopoverController,
    ) { }

  ngOnInit() {
    this.selected = this.translate.currentLang;
    this.userName = this.authenticationService.getName();
  }
  languageChange(code:string){
    this.selected = code;
    this.translate.use(code);
  }

  logout(){
    this.authenticationService.logout().subscribe(()=>{
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
