import { Routes } from '@angular/router';
import { StorageService } from './services/storage.service';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',    canActivate: [AuthGuard],

    loadComponent: () => import('./pages/home/home.page').then( m => m.HomePage)
  },
  {
    path: 'privacy-policy',    canActivate: [AuthGuard],

    loadComponent: () => import('./pages/privacy-policy/privacy-policy.page').then( m => m.PrivacyPolicyPage)
  },
  {
    path: 'camera-selector',    canActivate: [AuthGuard],

    loadComponent: () => import('./pages/camera-selector/camera-selector.page').then( m => m.CameraSelectorPage)
  },
  {
    path: 'language-selector',    canActivate: [AuthGuard],

    loadComponent: () => import('./pages/language-selector/language-selector.page').then( m => m.LanguageSelectorPage)
  },
  {
    path: 'terms-of-use',    canActivate: [AuthGuard],

    loadComponent: () => import('./pages/terms-of-use/terms-of-use.page').then( m => m.TermsOfUsePage)
  },
  {
    path: 'settings',    canActivate: [AuthGuard],

    loadComponent: () => import('./pages/settings/settings.page').then( m => m.SettingsPage)
  },
  {
    path: 'faqs',    canActivate: [AuthGuard],

    loadComponent: () => import('./pages/faqs/faqs.page').then( m => m.FaqsPage)
  },
  {
    path: 'qrinfo',
    canActivate: [AuthGuard],

    loadComponent: () => import('./pages/qrinfo/qrinfo.page').then( m => m.QRInfoPage)
  },
  {
    path: 'wallet',
    providers: [StorageService],
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/wallet/wallet.page').then( m => m.WalletPage)
  },
  {
    path: 'vc-selector',
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/vc-selector/vc-selector.page').then( m => m.VcSelectorPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },


];
