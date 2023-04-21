import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.page.html',
  styleUrls: ['./language-selector.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LanguageSelectorPage implements OnInit {
  languageList = [
    {
      name : "English",
      url : "assets/flags/uk.png"
    },
    {
      name: "Spanish",
      url : "assets/flags/es.png"
    }
  ]
  constructor() { }

  ngOnInit() {
  }

}
