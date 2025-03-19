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
  public isAuthenticated$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); 

  public constructor(public oidcSecurityService: OidcSecurityService) {
    this.checkAuth().subscribe();
  }
  public checkAuth() {
    return this.oidcSecurityService.checkAuth().pipe(
      map(({ userData, accessToken, isAuthenticated }) => {
        this.userData = userData;
        this.name.next(this.userData.name);
        this.token = accessToken;
        this.isAuthenticated$.next(isAuthenticated)
      })
    );
  }
  public logout() {
    this.isAuthenticated$.next(false);
    return this.oidcSecurityService.logoffAndRevokeTokens();
  }

  public getToken(): string {
    return this.token;
  }
  public getName(): Observable<string> {
    return this.name;
  }
}
