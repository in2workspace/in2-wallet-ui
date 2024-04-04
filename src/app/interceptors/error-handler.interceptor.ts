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
      catchError((error: HttpErrorResponse) => {
        // Handle the error globally
        switch (error.status) {
          case 422:
            this.toastServiceHandler.showErrorAlert(
              'home.unsucces',
              error.message
            ).subscribe();
            break;
          case 404:
            this.toastServiceHandler.showErrorAlert(
              'home.unsucces',
              error.message
            ).subscribe();
            break;
          case 500:
            console.error('error');
            this.toastServiceHandler
              .showErrorAlert('home.unsucces', error.message)
              .subscribe();
            break;
          case 0:
            this.toastServiceHandler.showErrorAlert(
              'home.unsucces',
              error.message
            );
            break;
          default:
            this.toastServiceHandler.showErrorAlert(
              'home.unsucces',
              error.message
            ).subscribe();
            break;
        }

        console.error('Error occurred:', error);
        return throwError(() => error);
      })
    );
  }
}
