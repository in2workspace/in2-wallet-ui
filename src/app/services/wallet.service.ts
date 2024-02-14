import {HttpClient, HttpHeaders} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {AuthenticationService} from './authentication.service';

export interface VCReply {
  selectedVcList: any[];
  state: string;
  redirectUri: string;
}

export interface ECResponse {
  selectableVcList: [];
  state: string;
  redirectUri: string;
}

const options = {};
const headers = new HttpHeaders({
  'Content-Type': 'application/json',
  'Allow-Control-Allow-Origin': '*',
});

@Injectable({
  providedIn: 'root',
})
export class WalletService {

  private http = inject(HttpClient);
  private authService = inject(AuthenticationService);

  // Send a request to the WCA to execute the content of a QR code
  public executeContent(url: string): Observable<any> {
    const options = {
      headers: headers,
      redirect: 'follow',
      responseType: 'text' as 'json',
    };
    return this.http.post(
      environment.wca_url + environment.walletUri.execute_content_uri,
      {qr_content: url},
      options
    );
  }

  public requestCredential(credentialOfferUri: string): Observable<any> {
    const options = {
      headers: headers,
      redirect: 'follow',
      responseType: 'text' as 'json',
    };
    return this.http.post(
      environment.wca_url + environment.walletUri.request_credential_uri,
      {credential_offer_uri: credentialOfferUri},
      options
    );
  }

  // Send the Selected VC List to the WCA to create the Verifiable Presentation
  public executeVC(_VCReply: VCReply): Observable<any> {
    return this.http.post(environment.wca_url + environment.walletUri.verifiable_presentation_uri, _VCReply, {
      headers: headers,
      responseType: 'text',
    });
  }

  // Request all Verifiable Credentials of a user from the Wallet Data
  public getAllVCs(): Observable<any> {
    const options = {headers: headers, redirect: 'follow'};
    return this.http.get(environment.data_url + environment.walletUri.credentials_uri, options);
  }

  // Request one Verifiable Credential of a user from the Wallet Data
  public getOne(data: string) {
    const options = {headers: headers, redirect: 'follow'};
    return this.http.get(
      environment.data_url + '/api/vc/1/' + data + '/format?format=vc_json',
      options
    );
  }

  // Deprecated
  public submitCredential(arg0: {}) {
    const options = {
      headers: headers,
      redirect: 'follow',
      responseType: 'text' as 'text',
    };
    return this.http.post(
      environment.wca_url + environment.walletUri.credentials_uri,
      arg0,
      options
    );
  }

  // Delete the selected Verifiable Credential from the Wallet Data
  deleteVC(VC: string) {
    const options = {
      headers: headers,
      redirect: 'follow',
      responseType: 'text' as 'text',
    };
    return this.http.delete(
      environment.data_url + environment.walletUri.credentials_by_id_uri + VC,
      options
    );
  }

}
