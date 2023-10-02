import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
const respuesta = 'response' as const;
const headers = new HttpHeaders({
  'Content-Type': 'application/json',
  'Allow-Control-Allow-Origin': '*',
});
const headers2 = new HttpHeaders({
  'Content-Type': 'application/x-www-form-urlencoded',
  'Allow-Control-Allow-Origin': '*',
});
const options = { headers: headers, redirect: 'follow', observe: respuesta };
const options2 = { headers: headers2, redirect: 'follow', observe: respuesta };

@Injectable({
  providedIn: 'root',
})
export class KeycloakService {
  private http = inject(HttpClient);
  public register(userData: any) {
    let registerData = {
      username: userData['username'],
      email: userData['email'],
      enabled: 'true2',
      firstName: 'John',
      lastName: 'Doe',
    };
    return this.http.post(
      environment.base_url + '/admin/realms/master/users',
      registerData,
      options
    );
  }

  public getToken() {
    let tokenData = {
      client_id: 'admin-rest-client',
      grant_type: 'password',
      //client_secret:'x8bmn320T5ninGh4egMtNPixbHpFSITw'
      username: 'admin',
      password: 'password',
    };
    return this.http.post(
      environment.base_url + '/realms/master/protocol/openid-connect/token',
      tokenData,
      options2
    );
  }
}
