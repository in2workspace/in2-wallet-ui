import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,TranslateModule]
})
export class LanguageSelectorPage implements OnInit {
  public translate= inject(TranslateService);

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
  constructor() { }

  ngOnInit() {
  }
  languageChange(code:string){
    this.translate.use(code)
    
  }
}
