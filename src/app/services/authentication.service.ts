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
  private logoutInProgress = false;

  public constructor(public oidcSecurityService: OidcSecurityService) {
    this.checkAuth().subscribe();
    this.monitorAuthentication()
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
    this.logoutInProgress = true;
    return this.oidcSecurityService.logoff().pipe(
      finalize(() => {
        this.logoutInProgress = false;
      })
    );
  }
  
  private monitorAuthentication(): void {
    this.oidcSecurityService.isAuthenticated$.subscribe((isAuthenticated) => {
      if (!isAuthenticated && !this.logoutInProgress) {
        const cleanUrl = `${window.location.origin}?nocache=${Date.now()}`;
        window.location.href = cleanUrl;
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
