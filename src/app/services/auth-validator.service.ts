import { Injectable, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthValidatorService {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private hasRedirected = false;

  validateAuthParams(): void {
    if (this.hasRedirected) return;
    
    const urlState = this.route.snapshot.queryParamMap.get('state');
    if (!urlState) {
      this.delayedRedirect();
      return;
    }
    
    const authClientData = localStorage.getItem('0-auth-client');
    if (!authClientData) {
      this.delayedRedirect();
      return;
    }

    const parsedData = JSON.parse(authClientData);
    const storedState = parsedData.authStateControl;

    if (urlState !== storedState) {
      delete parsedData.authStateControl;
      localStorage.setItem('0-auth-client', JSON.stringify(parsedData));
      this.delayedRedirect();
    }
  }

  private delayedRedirect(): void {
    this.hasRedirected = true;
    this.router.navigate(['/tabs/home']);
  }
}
