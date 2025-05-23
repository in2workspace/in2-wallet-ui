import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage-angular';
import {
  AuthModule,
  AuthInterceptor,
  authInterceptor
} from 'angular-auth-oidc-client';
import { HttpErrorInterceptor } from './app/interceptors/error-handler.interceptor';
import { IAM_PARAMS } from './app/constants/iam.constants';

document.addEventListener(
  'touchmove',
  function (event) {
    const noScrollPages = [
      '/tabs/settings',
      '/tabs/home'
    ];

    const currentPath = new URL(window.location.href).pathname;

    if (noScrollPages.includes(currentPath)) {
      event.preventDefault();
    }
  },
  { passive: false }
);

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    importProvidersFrom(
      IonicModule.forRoot({ innerHTMLTemplatesEnabled: true })
    ),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: httpTranslateLoader,
          deps: [HttpClient],
        },
      })
    ),
    importProvidersFrom(IonicStorageModule.forRoot()),
    importProvidersFrom( AuthModule.forRoot({
      config: {
        postLoginRoute: '/tabs/home',
        authority: environment.iam_url,
        redirectUrl: `${window.location.origin}/callback`,
        postLogoutRedirectUri: `${window.location.origin}`,
        clientId: IAM_PARAMS.CLIENT_ID,
        scope: IAM_PARAMS.SCOPE,
        responseType: IAM_PARAMS.GRANT_TYPE,
        silentRenew: true,
        useRefreshToken: true,
        ignoreNonceAfterRefresh: true,
        triggerRefreshWhenIdTokenExpired: false,
        autoUserInfo: false,
        secureRoutes:[environment.server_url]
      }
    })
    ),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    provideHttpClient(withInterceptors([authInterceptor()])),
    provideRouter(routes)
  ],
});
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
