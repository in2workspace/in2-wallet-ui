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
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errMessage = error.error?.message || error.message || 'Unknown Http error';

        if (
          errMessage?.startsWith('There is no credential available')
        ) {
          console.error('Handled silently:', errMessage);
        } 
        else if (request.url.endsWith(environment.server_uri.execute_content_uri) !&& error.error?.message
        ) {
          errMessage = 'There was a problem processing the QR. It might be invalid or already have been used';
        } else {
          if (error.status === 404) {
            console.error('Resource not found:', errMessage);
          } else if (error.status === 401) {
            console.error('Unauthorized:', errMessage);
          }  else {
            console.error('An HTTP error occurred:', errMessage);
          }
          this.toastServiceHandler
            .showErrorAlert(errMessage)
            .subscribe(); //TODO unsubscribe?
          console.error('Error occurred:', error);
        }
        return throwError(() => error);
      })
    );
  }
}
