import { Routes } from '@angular/router';
import { authGuard, notAuthGuard } from './guards/auth.guard';
import { StorageService } from './services/storage.service';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'privacy-policy',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/privacy-policy/privacy-policy.page').then(
        (m) => m.PrivacyPolicyPage
      ),
  },
  {
    path: 'camera-selector',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/camera-selector/camera-selector.page').then(
        (m) => m.CameraSelectorPage
      ),
  },
  {
    path: 'language-selector',
    canActivate: [authGuard],

    loadComponent: () =>
      import('./pages/language-selector/language-selector.page').then(
        (m) => m.LanguageSelectorPage
      ),
  },
  {
    path: 'terms-of-use',
    canActivate: [authGuard],

    loadComponent: () =>
      import('./pages/terms-of-use/terms-of-use.page').then(
        (m) => m.TermsOfUsePage
      ),
  },
  {
    path: 'settings',
    canActivate: [authGuard],

    loadComponent: () =>
      import('./pages/settings/settings.page').then((m) => m.SettingsPage),
  },
  {
    path: 'faqs',
    canActivate: [authGuard],

    loadComponent: () =>
      import('./pages/faqs/faqs.page').then((m) => m.FaqsPage),
  },
  {
    path: 'credential-offer',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/credential-offer/credential-offer.page').then(
        (m) => m.CredentialOfferPage
      ),
  },
  {
    path: 'credentials',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/credentials/credentials.page').then(
        (m) => m.CredentialsPage
      ),
  },
  {
    path: 'dids',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/dids/dids.page').then((m) => m.DidsPage),
  },
  {
    path: 'vc-selector',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/vc-selector/vc-selector.page').then(
        (m) => m.VcSelectorPage
      ),
  },
  {
    path: 'login',
    canActivate: [notAuthGuard],
    providers:[StorageService],
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },  
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then( m => m.RegisterPage)
  }
];
