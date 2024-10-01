import { Routes } from '@angular/router';
import { AutoLoginPartialRoutesGuard } from 'angular-auth-oidc-client';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
  },
  {
    path: 'tabs',
    loadComponent: () =>
      import('./pages/tabs/tabs.page').then((m) => m.TabsPage),
    children: [
      {
        path: 'home',
        canActivate: [AutoLoginPartialRoutesGuard],
        data: { credentialOfferUri: 'credentialOfferUri' },
        loadComponent: () =>
          import('./pages/home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'credentials',
        canActivate: [AutoLoginPartialRoutesGuard],
        loadComponent: () =>
          import('./pages/credentials/credentials.page').then(
            (m) => m.CredentialsPage
          ),
      },
      {
        path: 'settings',
        canActivate: [AutoLoginPartialRoutesGuard],

        loadComponent: () =>
          import('./pages/settings/settings.page').then((m) => m.SettingsPage),
        children: [],
      },
      {
        path: 'language-selector',
        canActivate: [AutoLoginPartialRoutesGuard],
        loadComponent: () =>
          import('./pages/language-selector/language-selector.page').then(
            (m) => m.LanguageSelectorPage
          ),
      },
      {
        path: 'camera-selector',
        canActivate: [AutoLoginPartialRoutesGuard],
        loadComponent: () =>
          import('./pages/camera-selector/camera-selector.page').then(
            (m) => m.CameraSelectorPage
          ),
      },
      {
        path: 'logs',
        loadComponent: () =>
          import('./pages/logs/logs.page').then(
            (m) => m.LogsPage
          ),
      },
      //TODO include as logs children
      {
        path: 'logs/camera',
        canActivate: [AutoLoginPartialRoutesGuard],
        loadComponent: () =>
          import('./pages/logs/camera-logs/camera-logs.page').then(
            (m) => m.CameraLogsPage
            ),
      },
      {
        path: 'vc-selector',
        canActivate: [AutoLoginPartialRoutesGuard],
        loadComponent: () =>
          import('./pages/vc-selector/vc-selector.page').then(
            (m) => m.VcSelectorPage
          ),
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'callback',
    loadComponent: () =>
      import('./pages/callback/callback.page').then((m) => m.CallbackPage),
  },
];
