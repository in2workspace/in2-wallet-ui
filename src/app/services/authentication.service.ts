import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, from, map, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';
import { Platform } from '@ionic/angular';
const respuesta = 'response' as const;
const headers = new HttpHeaders({
  'Content-Type': 'application/json',
  'Allow-Control-Allow-Origin': '*',
});
const options = { headers: headers, redirect: 'follow', observe: respuesta };
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private http = inject(HttpClient);
  private _storage = inject(StorageService);

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
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  token = '';

  public login(userData: any): Observable<any> {
    return this.http
      .post(environment.base_url + '/login', userData, options)
      .pipe(
        map((data: any) => {
          this.token = data.headers.get('Authorization');
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
      environment.base_url + '/api/users',
      userData,
      options
    );
  }

  public getName() {
    let username = JSON.parse(
      atob(this.token.split('Bearer ')[1].split('.')[1])
    )['username'];
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
