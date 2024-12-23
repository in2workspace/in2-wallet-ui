import { Injectable, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthValidatorService {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  validateAuthParams(): void {
    const urlState = this.route.snapshot.queryParamMap.get('state');

    const authClientData = localStorage.getItem('0-auth-client');
    if (!authClientData) {
      this.router.navigate(['/']);
      return;
    }

    const parsedData = JSON.parse(authClientData);
    const storedState = parsedData.authStateControl;

    if (urlState !== storedState) {
      console.error('State no válido. Redirigiendo a la página principal.');
      this.router.navigate(['/']);
    }
  }
}
