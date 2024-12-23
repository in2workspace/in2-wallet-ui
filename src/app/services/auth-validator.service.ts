import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthValidatorService {
  constructor(private readonly route: ActivatedRoute, private readonly router: Router) {}

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
