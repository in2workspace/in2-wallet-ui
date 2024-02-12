import { Routes } from '@angular/router';
import { AutoLoginPartialRoutesGuard } from 'angular-auth-oidc-client';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
  },

  {
    path: 'privacy-policy',
    loadComponent: () =>
      import('./pages/privacy-policy/privacy-policy.page').then(
        (m) => m.PrivacyPolicyPage
      ),
  },
  {
    path: 'terms-of-use',
    loadComponent: () =>
      import('./pages/terms-of-use/terms-of-use.page').then(
        (m) => m.TermsOfUsePage
      ),
  },
 
  {
    path: 'faqs',
    loadComponent: () =>
      import('./pages/faqs/faqs.page').then((m) => m.FaqsPage),
  },
  {
    path: 'tabs',
    loadComponent: () => import('./pages/tabs/tabs.page').then(m => m.TabsPage),
    children: [
      {
        path: 'home',
        canActivate: [AutoLoginPartialRoutesGuard],
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
          children:[
           ]
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
        pathMatch: 'full'
      }
    ]
  },
  { path: 'callback',
  loadComponent: () => import('./pages/callback/callback.page').then( m => m.CallbackPage)
  }
];
