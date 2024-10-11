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
  authInterceptor,
} from 'angular-auth-oidc-client';
import { HttpErrorInterceptor } from './app/interceptors/error-handler.interceptor';

if (environment.production) {
  enableProdMode();
}

//if there are client_id & request_uri query params, add them to callback url
let redirectCallbackUrl = `${window.location.origin}/callback`;

const { clientId, requestUri } = getQueryParams();
const params = new URLSearchParams();
if (clientId) {
  params.append('client_id', clientId);
}
if (requestUri) {
  params.append('request_uri', requestUri);
}

if (clientId && requestUri && params.toString()) {
  redirectCallbackUrl += `?${params.toString()}`;
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    importProvidersFrom(
      IonicModule.forRoot({ innerHTMLTemplatesEnabled: true })
    ),
    provideHttpClient(withInterceptorsFromDi()),
    //importProvidersFrom(HttpClientTestingModule),
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
        authority: environment.iam_url+environment.iam_params.iam_uri,
        redirectUrl: redirectCallbackUrl,
        postLogoutRedirectUri: window.location.origin,
        clientId: environment.iam_params.client_id,
        scope: environment.iam_params.scope,
        responseType: environment.iam_params.grant_type,
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
    provideRouter(routes),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
  ],
});
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

function getQueryParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const clientId = urlParams.get('client_id');
  const requestUri = urlParams.get('request_uri');
  return { clientId, requestUri };
}