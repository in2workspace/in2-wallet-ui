import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class CallbackPage{
}
