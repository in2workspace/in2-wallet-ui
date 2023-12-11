import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {AuthenticationService} from 'src/app/services/authentication.service';
import {Router, RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';

interface LoginForm {
  username: FormControl<string | null>;
  email: FormControl<string | null>;
  password?: FormControl<string | null>;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  standalone: true,
  styleUrls: ['./register.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, RouterModule, TranslateModule]
})
export class RegisterPage {
  login = new FormGroup<LoginForm>({

    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    /*username: new FormControl('', {nonNullable: true}),
    email: new FormControl('', {nonNullable: true}),
    password: new FormControl('', {nonNullable: true}),*/
  });

  showEmailError: boolean = false;

  error: string = '';

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
  ) {
  }

  onSubmit() {
    this.authenticationService.register(this.login.value).subscribe(() => {
        this.router.navigate(['/login/'], {})
      },
      (error) => {
        this.error = 'register.error';
      }
    );

  }

  handleEmailBlur() {
    this.showEmailError = true;
  }

}
