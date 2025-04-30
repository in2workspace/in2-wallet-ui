import { Injectable, inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastServiceHandler } from '../services/toast.service';
import { SERVER_PATH } from '../constants/api.constants';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  private toastServiceHandler = inject(ToastServiceHandler);

  private logHandledSilentlyErrorMsg(errMsg: string){
    console.error('Handled silently:', errMsg);
  }

  public intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    //todo refactor this handler (conditional structure)
    return next.handle(request).pipe(
      catchError((errorResp: HttpErrorResponse) => {
        let errMessage = errorResp.error?.message || errorResp.message || 'Unknown Http error';
        let errStatus = errorResp.status ?? errorResp.error?.status;

        //DONT'T SHOW POPUP CASES
        if ( //todo review this handler
          errMessage?.startsWith('The credentials list is empty') &&
          request.url.endsWith(SERVER_PATH.CREDENTIALS)
        ) {
          this.logHandledSilentlyErrorMsg(errMessage);
          return throwError(() => errorResp);
        }
        if(request.url.endsWith(SERVER_PATH.VERIFIABLE_PRESENTATION))
        {
          this.logHandledSilentlyErrorMsg(errMessage);
          return throwError(() => errorResp);
        } 
        if(      
          errStatus === 0 && request.url.includes('/keycloak/')){
          this.logHandledSilentlyErrorMsg('No connection to Keycloak' + errMessage);
          return throwError(() => errorResp);
        }

        //SHOW POPUP CASES
        //same-device credential offer request
        if(request.url.endsWith(
          SERVER_PATH.REQUEST_CREDENTIAL) 
          && (errStatus === 408 || errStatus === 504)
        ){
          console.log('error is detected')
          errMessage = "PIN expired"
        } 
        //cross-device 
        else if (request.url.endsWith(SERVER_PATH.EXECUTE_CONTENT)){
          if(errMessage.startsWith('The credentials list is empty')){
            errMessage = "There are no credentials available to login";
          }
          else if(errMessage.startsWith('Incorrect PIN')){
            //simply don't change the message, the one from backend is ok
          }else if(errorResp.status === 504 || errorResp.status === 408){
            //504 for nginx Gateway timeout, 408 for backend
            errMessage = "PIN expired"
          }
          else if(!errMessage.startsWith('The received QR content cannot be processed'))
          {
            errMessage = 'There was a problem processing the QR. It might be invalid or already have been used';
          }
        }else if(errStatus === 0){
          errMessage = 'No internet connection'
        }
        this.toastServiceHandler
          .showErrorAlert(errMessage)
          .subscribe(); //TODO unsubscribe?
        console.error('Error occurred:', errorResp);
        
        return throwError(() => errorResp);
      })
    );
  }
}
