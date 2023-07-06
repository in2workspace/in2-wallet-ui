import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
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
  isLogin = false;

  constructor(private http: HttpClient) {}

  public login(userData: any): Observable<any> {
    return this.http.post(environment.base_url + '/login', userData, options);
  }
  public register(userData: any) {
    return this.http.post(
      environment.base_url + '/register',
      userData,
      options
    );
  }
  public isLoggedIn() {
    const loggedIn = localStorage.getItem('token');
    if (loggedIn) {
      let expired = JSON.parse(
        atob(loggedIn.split('Bearer ')[1].split('.')[1])
      )['exp'];
      if (Date.now() <= expired * 1000) this.isLogin = true;
    } else this.isLogin = false;
    return this.isLogin;
  }

  public logout() {
    localStorage.removeItem('token');
    this.isLogin = false;
  }
}
