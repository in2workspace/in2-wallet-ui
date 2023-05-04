import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  constructor(private http:HttpClient) { }


  public executeURL(url:string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Allow-Control-Allow-Origin': '*'})
    const options = { headers: headers, redirect : 'follow' };
    return this.http.post(
      environment.base_url + '/api/execute-content/get-siop-authentication-request', 
      {"qr_content":url},options)
    }

  public executeVC(state:string,vc:Array<string>): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Allow-Control-Allow-Origin': '*'})
    return this.http.post(
      environment.base_url + '/api/execute-content/vp',{"vc_list":vc,"siop_authentication_request":state},
      { headers: headers, responseType: 'text'}
    )
    }
}
