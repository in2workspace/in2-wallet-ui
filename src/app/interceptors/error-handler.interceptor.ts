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

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  private toastServiceHandler = inject(ToastServiceHandler);

  public intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (
          error.error.message?.startsWith('There is no credential available')
        ) {
          console.error('Handled silently:', error.message);
        } else {
          if (error.status === 404) {
            console.error('Resource not found:', error.message);
          } else if (error.status === 401) {
            console.error('Unauthorized:', error.message);
          }  else {
            console.error('An HTTP error occurred:', error.message);
          }
          this.toastServiceHandler
            .showErrorAlert(error.error.message)
            .subscribe();
          console.error('Error occurred:', error);
        }
        return throwError(() => error);
      })
    );
  }
}
