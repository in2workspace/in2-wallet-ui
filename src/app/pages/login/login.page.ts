import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router, RouterModule } from '@angular/router';
interface LoginForm {
  username: FormControl<string>;
  password: FormControl<string>;
}
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule,RouterModule]
})
export class LoginPage {
  login = new FormGroup<LoginForm>({
    username: new FormControl('', {nonNullable: true}),
    password: new FormControl('', {nonNullable: true}),
});

private authenticationService = inject(AuthenticationService);
private router = inject(Router);

  onSubmit(){
    this.authenticationService.login(this.login.value).subscribe(()=>{
      this.router.navigate(['/home/'], {})
  })
  }  
}
