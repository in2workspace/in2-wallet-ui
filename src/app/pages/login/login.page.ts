import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule, LoadingController} from '@ionic/angular';
import {AuthenticationService} from 'src/app/services/authentication.service';
import {Router, RouterModule} from '@angular/router';
import {environment} from 'src/environments/environment';
import {TranslateModule} from '@ngx-translate/core';

interface LoginForm {
  username: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, RouterModule, TranslateModule]
})
export class LoginPage {
  environment = environment
  login = new FormGroup<LoginForm>({
    username: new FormControl('', {nonNullable: true}),
    password: new FormControl('', {nonNullable: true}),
  });
  error: string = '';

  private authenticationService = inject(AuthenticationService);
  private router = inject(Router);
  private loadingCtrl = inject( LoadingController);
  async onSubmit() {
    const loading = await this.loadingCtrl.create({
    });

    loading.present();
    // fixme: .subscribe() is deprecated, use .toPromise() instead
    this.authenticationService.login().subscribe({
      next: () => {
        // fixme: this.router.navigate() needs then().
        this.router.navigate(['/tabs/home/'], {})
      },
      error: (error) => {
        console.log("ERR:", error);
        this.error = 'login.error';
        console.log("ERR2:", error);
      }}
    ).add(() => {
      loading.dismiss();
    });
  }

}
