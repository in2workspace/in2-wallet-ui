import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WalletService {


  constructor(private http:HttpClient) { }


  public executeContent(url:string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Allow-Control-Allow-Origin': '*'})
    const options = { headers: headers, redirect : 'follow',responseType: 'text' as 'json' };
    return this.http.post(
      environment.base_url + '/api/execute-content', 
      {"qr_content":url},options)
    }
  public getOne(data: string) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Allow-Control-Allow-Origin': '*'})
      const options = { headers: headers, redirect : 'follow' };
      return this.http.get(
        environment.base_url + '/api/vc/1/'+data+'/format/vc_json', 
        options)
    }  
  public executeVC(vc:Array<string>,siop_authentication_request:any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Allow-Control-Allow-Origin': '*'})
    return this.http.post(
      environment.base_url + '/api/execute-content/vp/v2',{"siop_authentication_request":siop_authentication_request,"vc_list":vc},
      { headers: headers, responseType: 'text'}
    )
    }
  public getAll(){
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Allow-Control-Allow-Origin': '*'})
      const options = { headers: headers, redirect : 'follow' };
      return this.http.get(
        environment.base_url + '/api/vc/1/format/vc_json', 
        options)
    }
}
