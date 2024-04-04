// http-error.interceptor.ts
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

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: Error) => {
        this.toastServiceHandler.showError(error.message).subscribe();
        console.error('Error occurred:', error);
        return throwError(() => error);
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          console.error('Resource not found:', error.message);
        } else if (error.status === 401) {
            console.error('Unauthorized:', error.message);
        } else {
            console.error('An HTTP error occurred:', error.message);
        }
        this.toastServiceHandler.showErrorAlert(error.error.message).subscribe();

        console.error('Error occurred:', error);
        return throwError(() => error);
      })
    );
  }
}
