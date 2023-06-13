import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const respuesta = 'response'  as const;

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  isLogin = false;

  constructor(private http:HttpClient) { }
  
  public login(userData:any): Observable<any> {
    console.log(userData)
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Allow-Control-Allow-Origin': '*'})
    const options = { headers: headers, redirect : 'follow',observe: respuesta};
    return this.http.post(
      environment.base_url + '/login', 
      userData,options  )
    }
    isLoggedIn() {
      const loggedIn = localStorage.getItem('token');
      if (loggedIn )
        this.isLogin = true;
      else
        this.isLogin = false;
      return this.isLogin;
    }
    logout(){
      const loggedIn = localStorage.removeItem('token');
      this.isLogin = false;

    }
}
