import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthValidatorService } from '../../services/auth-validator.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.page.html',
  styleUrls: ['./callback.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TranslateModule]
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class CallbackPage{
  public constructor(private readonly authValidatorService: AuthValidatorService) {}

  ngAfterViewInit(): void {
    this.authValidatorService.validateAuthParams();
  }
}
