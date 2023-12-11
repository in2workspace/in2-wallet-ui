import {HttpClient, HttpHeaders} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, map, Observable, switchMap, tap} from 'rxjs';
import {environment} from 'src/environments/environment';
import {StorageService} from './storage.service';
import {OidcSecurityService} from 'angular-auth-oidc-client';

const respuesta = 'response' as const;
const headers = new HttpHeaders({
  'Content-Type': 'application/json',
});
const options = {headers: headers, redirect: 'follow', observe: respuesta};
const keycloakOptions = {
  headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  observe: respuesta,
};

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private http = inject(HttpClient);
  private _storage = inject(StorageService);

  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  token = '';
  userData: any;

  constructor(public oidcSecurityService: OidcSecurityService) {
    this.oidcSecurityService.checkAuth().subscribe(({isAuthenticated, userData, accessToken}) => {
      this.isAuthenticated.next(isAuthenticated);
      this.userData = userData;
      this.token = accessToken
    });

  }


  login() {
    return this.oidcSecurityService.authorizeWithPopUp().pipe(
      map(({isAuthenticated, userData, accessToken}) => {
        this.isAuthenticated.next(isAuthenticated);
        this.userData = userData;
        this.token = accessToken;
      })
    );
  }

  logout() {
    return this.oidcSecurityService.logoff().pipe(
      map((data: any) => {
        this.token = data.accessToken;
        return this.token;
      }),
      switchMap((token) => {
        return token;
      }),
      tap((_) => {
        this.isAuthenticated.next(true);
      })
    );
  }

  public register(userData: any) {
    return this.http.post(
      environment.registerParams.register_url + '/api/v1/users',
      userData,
      options
    );
  }

  public getName() {
    return this.userData.name;
  }

  public isAuth(): Observable<boolean> {
    return this.isAuthenticated;
  }
}
