import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private didSubject = new BehaviorSubject<string>("");

  constructor(private http: HttpClient) { }

  sendDid(did: string) {
    this.didSubject.next(did);
  }

  listenDid(): any {
    return this.didSubject;
  }

  getDid() {
    return this.http.get(environment.server_url + environment.server_uri.ebsi_did_uri, { responseType: 'text' }).pipe(
      map((data) => {
        return data.toString()
      }),
      catchError((err) => {
        throw new Error("Err");
      })
    )
  }

}
