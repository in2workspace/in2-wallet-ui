import { Injectable, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthValidatorService {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private hasRedirected = false;

  async validateAuthParams(): Promise<void> {
    if (this.hasRedirected) return;
    
    const urlState = this.route.snapshot.queryParamMap.get('state');
    if (!urlState) {
      console.error('State no presente en la URL.');
      await this.delayedRedirect();
      return;
    }
    
    const authClientData = localStorage.getItem('0-auth-client');
    if (!authClientData) {
      await this.delayedRedirect();
      return;
    }

    const parsedData = JSON.parse(authClientData);
    const storedState = parsedData.authStateControl;

    if (urlState !== storedState) {
      console.error('State no válido. Limpiando y redirigiendo...');
      delete parsedData.authStateControl;
      localStorage.setItem('0-auth-client', JSON.stringify(parsedData));
      await this.delayedRedirect();
      return;
    }
  }

  private delayedRedirect(): Promise<void> {
    this.hasRedirected = true;

    return new Promise((resolve) => {
      setTimeout(() => {
        this.router.navigate(['/tabs/home']);
        resolve();
      }, 1000);
    });
  }
}
