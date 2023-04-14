import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then( m => m.HomePage)
  },
  {
    path: 'privacy-policy',
    loadComponent: () => import('./pages/privacy-policy/privacy-policy.page').then( m => m.PrivacyPolicyPage)
  },
  {
    path: 'camera-selector',
    loadComponent: () => import('./pages/camera-selector/camera-selector.page').then( m => m.CameraSelectorPage)
  },
  {
    path: 'language-selector',
    loadComponent: () => import('./pages/language-selector/language-selector.page').then( m => m.LanguageSelectorPage)
  },
  {
    path: 'terms-of-use',
    loadComponent: () => import('./pages/terms-of-use/terms-of-use.page').then( m => m.TermsOfUsePage)
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.page').then( m => m.SettingsPage)
  },
  {
    path: 'faqs',
    loadComponent: () => import('./pages/faqs/faqs.page').then( m => m.FaqsPage)
  },
];
