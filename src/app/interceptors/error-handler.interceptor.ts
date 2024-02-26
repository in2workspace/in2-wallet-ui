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
  private toastServiceHandler = inject( ToastServiceHandler);

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle the error globally
          switch (error.status) {
            case 422:
              this.toastServiceHandler.showErrorAlert( 'home.unsucces', 'home.no-credential' || error.message);
              break;
            case 404:
              this.toastServiceHandler.showErrorAlert('', error.message || 'Ha ocurrido un error');
              break;
          }

        console.error('Error occurred:', error);
        return throwError(() => error);
      })
    );
  }
}
