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
import { environment } from 'src/environments/environment';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  private toastServiceHandler = inject(ToastServiceHandler);

  public intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    //todo refactor this handler (conditional structure)
    return next.handle(request).pipe(
      catchError((errorResp: HttpErrorResponse) => {
        let errMessage = errorResp.error?.message || errorResp.message || 'Unknown Http error';
        let errStatus = errorResp.status || errorResp.error?.status;
        console.info('request url: ');
        console.info(request.url);
        console.info('status: ');
        console.info(errStatus);
        console.info(request.url.endsWith(
          environment.server_uri.request_credential_uri) 
          && (errStatus === 408 || errStatus === 504));
          //same-device
        if(request.url.endsWith(
          environment.server_uri.request_credential_uri) 
          && (errStatus === 408 || errStatus === 504)
        ){
          console.log('error is detected')
          errMessage = "PIN expired"
        }
        else if ( //todo review this handler
          errMessage?.startsWith('The credentials list is empty') &&
          request.url.endsWith(environment.server_uri.credentials_uri)
        ) {
          console.error('Handled silently:', errMessage);
        }
        else if(request.url.endsWith(environment.server_uri.verifiable_presentation_uri))
        {
          console.error('Handled silently:', errMessage);
        } 
        //same-device credential offer request
        else if(request.url.endsWith(
          environment.server_uri.request_credential_uri) 
          && (errStatus === 408 || errStatus === 504)
        ){
          console.log('error is detected')
          errMessage = "PIN expired"
        }
        else {
          if (request.url.endsWith(environment.server_uri.execute_content_uri))
          {
            if(errMessage.startsWith('The credentials list is empty')){
              errMessage = "There are no credentials available to login";
            }
            else if(errMessage.startsWith('Incorrect PIN')){
              //simply don't change the message
            }else if(errorResp.status === 504 || errorResp.status === 408){
              //504 for nginx Gateway timeout, 408 for backend
              errMessage = "PIN expired"
            }
            else if(!errMessage.startsWith('The received QR content cannot be processed'))
            {
              errMessage = 'There was a problem processing the QR. It might be invalid or already have been used';
            }
          }
          if (errorResp.status === 404) {
            console.error('Resource not found:', errMessage);
          } else if (errorResp.status === 401) {
            console.error('Unauthorized:', errMessage);
          }  else {
            console.error('An HTTP error occurred:', errMessage);
          }
          this.toastServiceHandler
            .showErrorAlert(errMessage)
            .subscribe(); //TODO unsubscribe?
            console.log('error message sent to alert');
            console.log(errMessage);
          console.error('Error occurred:', errorResp);
        }
        return throwError(() => errorResp);
      })
    );
  }
}
