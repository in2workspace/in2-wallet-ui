import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';
import { RegisterService } from 'src/app/services/register.service';
interface LoginForm {
  username: FormControl<string>;
  email: FormControl<string>;
  password?: FormControl<string>;
}
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class RegisterPage {
  login = new FormGroup<LoginForm>({
    username: new FormControl('', {nonNullable: true}),
    email: new FormControl('', {nonNullable: true}),
    password: new FormControl('', {nonNullable: true}),
});

  constructor(
    private registerService:RegisterService,
    private router: Router,
    ) { }
  onSubmit(){
    this.registerService.register(this.login.value);
    this.router.navigate(['/login/'], {})

  }  
}
