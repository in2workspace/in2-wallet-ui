import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule,TranslateService } from '@ngx-translate/core';
import { StorageService } from 'src/app/services/storage.service';
import { BehaviorSubject, distinctUntilChanged, map, shareReplay } from 'rxjs';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,TranslateModule]
})
export class LanguageSelectorPage implements OnInit {
  public translate= inject(TranslateService);
  private storageService = inject(StorageService);
  selected = {name:"",code:""} ;
  language = {name:"",code:""};
  userName: string = '';
  private languages = new BehaviorSubject<any>("");
  languageList = [
    {
      name : "English",
      code : "en"
    },
    {
      name: "Castellano",
      code : "es"
    },
    {
      name: "Català",
      code : "ca"
    }
  ]
  languageSelected = this.languages.pipe(
    map((device) => {
      let lang = {};
       this.languageList.forEach((language) =>{
        if (language.code === device) {
          lang = language;
        }})
        return lang
  }),
    distinctUntilChanged(),
    shareReplay(1)
  );  

  ngOnInit() {
    this.storageService.get("language").then((datos)=>{
      this.languages.next(datos);
    });
    let lang = this.languageList.forEach((language) =>{
      if (language.code === this.translate.currentLang) {
        this.selected = language;
      }})
    if(lang!= undefined)this.selected = lang;
    if(this.translate.currentLang == undefined) this.selected = this.languageList[2];
  }
  languageChange(code:any){
    this.translate.use(code.code);
    this.storageService.set("language",code.code);
  }
}
