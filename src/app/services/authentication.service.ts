import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, from, map, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';

const respuesta = 'response' as const;
const headers = new HttpHeaders({
  'Content-Type': 'application/x-www-form-urlencoded',
});
const options = { headers: headers, redirect: 'follow', observe: respuesta };
const keycloakOptions = {
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
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
  
  constructor() {
    this._storage.get('token').then((savedToken) => {
      if (!savedToken) {
        this.token = '';
        this.isAuthenticated.next(false);
      } else {
        this.token = savedToken;
        this.isAuthenticated.next(true);
      }
    });
  }

  public login(userData: any): Observable<any> {
    let body = new URLSearchParams();
    body.set('client_id', environment.loginParams.client_id);
    body.set('username', userData.username);
    body.set('password', userData.password);
    body.set('client_secret', environment.loginParams.client_secret);
    body.set('grant_type', environment.loginParams.grant_type);
    return this.http.post(environment.loginParams.login_url+'/realms/EAAProvider/protocol/openid-connect/token', body, keycloakOptions).pipe(
      map((data: any) => {
        this.token = data.body.access_token;
        return this.token;
      }),
      switchMap((token) => {
        return this._storage.set('token', token);
      }),
      tap((_) => {
        this.isAuthenticated.next(true);
      })
    );
  }
  public register(userData: any) {
    return this.http.post(
      environment.api_url + '/api/users',
      userData,
      options
    );
  }

  public getName() {
    let username = JSON.parse(
      atob(this.token.split('.')[1])
    )['name'];
    return username;
  }
  public logout() {
    this.isAuthenticated.next(false);
    this._storage.remove('token');
  }
  public isAuth(): Observable<boolean> {
    return from(this._storage.get('token')).pipe(
      map((savedToken: string) => {
        if (!savedToken) {
          this.token = '';
          this.isAuthenticated.next(false);
          return false;
        }
        this.token = savedToken;
        this.isAuthenticated.next(true);
        return true;
      })
    );
  }
}
