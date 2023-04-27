import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  constructor(private http:HttpClient) { }


  public executeQR(state:string): Observable<any> {


  const headers = new HttpHeaders({
    'Content-Type': 'application/json'})

  return this.http.get(
    environment.base_url + '/wallet/execute-content/get-credentials-type', 
    { headers: headers, params:{state:state}, responseType: 'text'}
  )
  }
  public executeVC(state:string,vc:(string)[]): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'})
  
    return this.http.post(
      environment.base_url + '/wallet/execute-content/vp',{vc:vc} ,
      { headers: headers, params:{state:state}, responseType: 'text'}
    )
    }
}
