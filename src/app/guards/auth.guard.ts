import { inject } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { map } from 'rxjs';

export const authGuard = () => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);
  if(authService.isAuthenticated.value) return true;
  return authService.isAuth().pipe(map(
    (isLogged:boolean) => {
      if(isLogged){
        return true;
      }
      router.navigate(['/login'], {})

      return false;
    }
  ));
}
export const notAuthGuard = () => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);
  if(authService.isAuthenticated.value) return false;
  return authService.isAuth().pipe(map(
    (isLogged:boolean) => {
      if(isLogged){
        router.navigate(['/tabs/home'], {})
        return false;
      }

      return true;
    }
  ));
  }
