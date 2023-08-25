import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router, RouterModule } from '@angular/router';

interface LoginForm {
  username: FormControl<string>;
  email: FormControl<string>;
  password?: FormControl<string>;
}
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  standalone: true,
  styleUrls: ['./register.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule,RouterModule]
})
export class RegisterPage {
  login = new FormGroup<LoginForm>({
    username: new FormControl('', {nonNullable: true}),
    email: new FormControl('', {nonNullable: true}),
    password: new FormControl('', {nonNullable: true}),
});

  constructor(
    private authenticationService:AuthenticationService,
    private router: Router,
    ) { }
  onSubmit(){
    this.authenticationService.register(this.login.value).subscribe(response => {console.log(response)});
    this.router.navigate(['/login/'], {})

  }  
}
