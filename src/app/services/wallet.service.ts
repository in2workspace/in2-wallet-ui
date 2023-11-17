import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './authentication.service';
export interface VCReply{
  selectedVcList:any[],
  state:string,
  redirectUri:string  
}
export interface ECResponse{
  selectableVcList:[],
  state:string,
  redirectUri:string  
}
const options ={};
const headers = new HttpHeaders({
  'Content-Type': 'application/json',
  'Allow-Control-Allow-Origin': '*'})
@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private http = inject(HttpClient)
  private authService = inject(AuthenticationService);
  constructor() { 
    headers.append('Authorization', 'Bearer '+this.authService.token)
   }

  public apisiop(url:string): Observable<any> {
    const options = { headers: headers, redirect : 'follow',responseType: 'text' as 'json' };
    return this.http.post(
      environment.wca_url + '/api/siop', 
      {"qr_content":url},options)
    }
    public executeContent(url:string): Observable<any> {

      const options = { headers: headers, redirect : 'follow',responseType: 'text' as 'json' };
      return this.http.post(
        environment.api_url + '/api/execute-content',       {"qr_content":url},options)
      }
  public executeVC(_VCReply:VCReply): Observable<any> {


    return this.http.post(
      environment.wca_url  + '/api/vp',_VCReply,
      { headers: headers, responseType: 'text'}
    )
    }
  public getAllVCs():Observable<any>{


      const options = { headers: headers, redirect : 'follow' };
      return this.http.get(
        environment.data_url + '/api/credentials', 
        options)
    }
    public getAllDIDs():Observable<any>{


      const options = { headers: headers, redirect : 'follow' };
      return this.http.get(
        environment.data_url + '/api/dids', 
        options)
    }
    public getOne(data: string) {


      const options = { headers: headers, redirect : 'follow' };
      return this.http.get(
        environment.data_url + '/api/vc/1/'+data+'/format?format=vc_json', 
        options)
    }  
    postDid(arg0: { didType: string; did:any}) {


      const options = { headers: headers, redirect : 'follow',responseType:'text' as 'text' };
      return this.http.post(
        environment.data_url + '/api/dids', arg0,
        options)
    }
    deleteDid(did:string) {


      const options = { headers: headers, redirect : 'follow',responseType:'text' as 'text' };
      return this.http.delete(
        environment.data_url + '/api/dids?did=' + did,
        options)
    }
    public getAllIssuers():Observable<any>{


      const options = { headers: headers, redirect : 'follow' };
      return this.http.get(
        environment.wca_url + '/api/issuers', 
        options)
    }
    public submitCredential(arg0: { }) {


      const options = { headers: headers, redirect : 'follow',responseType:'text' as 'text' };
      return this.http.post(
        environment.wca_url + '/api/credentials', arg0,
        options)
    }
    deleteVC(VC:string) {


      const options = { headers: headers, redirect : 'follow',responseType:'text' as 'text' };
      return this.http.delete(
        environment.data_url + '/api/credentials?credentialId='+VC,
        options)
    }
    createCrypto(){


      const options = { headers: headers, redirect : 'follow' ,responseType:'text' as 'text' };
      return this.http.post(
        environment.crypto_url + '/api/v1/dids/key',{} ,
        options)
    }}
