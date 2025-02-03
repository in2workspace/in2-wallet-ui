import { Routes } from '@angular/router';
import { AutoLoginPartialRoutesGuard } from 'angular-auth-oidc-client';
import { logsEnabledGuard } from '../../guards/logs-enabled.guard';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./tabs.page').then((m) => m.TabsPage),
    children: [
      {
        path: 'home',
        // canActivate: [AutoLoginPartialRoutesGuard],
        data: { credentialOfferUri: 'credentialOfferUri' },
        loadComponent: () =>
          import('../home/home.page').then((m) => m.HomePage),
        children: [
          {
            path: 'openid-credential-offer',
            // canActivate: [AutoLoginPartialRoutesGuard],
            data: { credentialOfferUri: 'credentialOfferUri' },
            loadComponent: () =>
              import('../credentials/credentials.page').then(
                (m) => m.CredentialsPage
              ),
          }
        ]
      },
      {
        path: 'credentials',
        // canActivate: [AutoLoginPartialRoutesGuard],
        loadComponent: () =>
          import('../credentials/credentials.page').then((m) => m.CredentialsPage),
      },
      {
        path: 'settings',
        // canActivate: [AutoLoginPartialRoutesGuard],
        loadComponent: () =>
          import('../settings/settings.page').then((m) => m.SettingsPage),
      },
      {
        path: 'language-selector',
        // canActivate: [AutoLoginPartialRoutesGuard],
        loadComponent: () =>
          import('../language-selector/language-selector.page').then(
            (m) => m.LanguageSelectorPage
          ),
      },
      {
        path: 'camera-selector',
        // canActivate: [AutoLoginPartialRoutesGuard],
        loadComponent: () =>
          import('../camera-selector/camera-selector.page').then(
            (m) => m.CameraSelectorPage
          ),
      },
      {
        path: 'logs',
        // canActivate: [AutoLoginPartialRoutesGuard, logsEnabledGuard],
        loadComponent: () =>
          import('../logs/logs.page').then((m) => m.LogsPage),
        children: [
          {
            path: '',
            loadComponent: () =>
              import('../logs/logs/logs.component').then((m) => m.LogsComponent),
          },
          {
            path: 'camera',
            loadComponent: () =>
              import('../logs/camera-logs/camera-logs.page').then((m) => m.CameraLogsPage),
          },
          {
            path: '**',
            redirectTo: '/',
          }
        ],
      },
      {
        path: 'vc-selector',
        // canActivate: [AutoLoginPartialRoutesGuard],
        loadComponent: () =>
          import('../vc-selector/vc-selector.page').then((m) => m.VcSelectorPage),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: '/',
      }
    ],
  },
];

export default routes;
