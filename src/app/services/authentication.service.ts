import { Injectable } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { BehaviorSubject, Observable, finalize, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public name: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private token!: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private userData: any;

  public constructor(public oidcSecurityService: OidcSecurityService) {
    this.checkAuth().subscribe();
    this.listenToStsCallback();
  }
  public checkAuth() {
    return this.oidcSecurityService.checkAuth().pipe(
      map(({ userData, accessToken }) => {
        this.userData = userData;
        this.name.next(this.userData.name);
        this.token = accessToken;
      })
    );
  }
  public logout() {
    return this.oidcSecurityService.logoff();
  }

  private listenToStsCallback(): void {
    this.oidcSecurityService.stsCallback$.subscribe(() => {
      console.log('Evento del servidor recibido. Validando estado de la sesión...');
      const token = this.oidcSecurityService.getAccessToken();
      if (!token) {
        console.log('Sesión invalidada. Redirigiendo al dominio base...');
        const cleanUrl = `${window.location.origin}?nocache=${Date.now()}`;
        window.location.href = cleanUrl;
      } else {
        console.log('El token sigue activo. No se redirige.');
      }
    });
  }

  public getToken(): string {
    return this.token;
  }
  public getName(): Observable<string> {
    return this.name;
  }
}
