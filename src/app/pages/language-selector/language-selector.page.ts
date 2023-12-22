import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule,TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

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
      name : "English",
      url : "assets/flags/uk.png",
      code : "en"
    },
    {
      name: "Castellano",
      url : "assets/flags/es.png",
      code : "es"
    },
    {
      name: "Català",
      url : "assets/flags/ca.png",
      code : "ca"
    }
  ]
  constructor(    private authenticationService: AuthenticationService
    ) { }

  ngOnInit() {
    this.selected = this.translate.currentLang;
  }
  languageChange(code:string){
    this.selected = code;
    this.translate.use(code);

    
  }
}
