import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.page.html',
  styleUrls: ['./callback.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TranslateModule]
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class CallbackPage{
    constructor(private readonly router: Router) {}
    ngAfterViewInit(): void {
      setTimeout(() => {
        console.log('navigate to home from callback page')
        this.router.navigate(['/tabs/home']);
      }, 2000);
    }
}
