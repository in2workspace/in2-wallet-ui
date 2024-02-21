import { Injectable} from '@angular/core';
import { OidcSecurityService} from 'angular-auth-oidc-client';


@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {


  private token!: string;
  private userData: any;

  constructor(public oidcSecurityService: OidcSecurityService) {
    this.oidcSecurityService.checkAuth().subscribe(({ userData, accessToken }) => {
      this.userData = userData;
      this.token = accessToken;
    });
  }
  public logout() {
    return this.oidcSecurityService.logoff();
  }
  public getToken():string{
    return  this.token;
  }
  public getName():string {
    return this.userData.preferred_username;
  }
}