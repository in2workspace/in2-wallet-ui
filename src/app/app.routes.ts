import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.routes').then(m => m.default),
  },
  {
    path: 'callback',
    loadComponent: () => import('./pages/callback/callback.page').then((m) => m.CallbackPage),
  },
  {
    path: '**',
    redirectTo: '/',
  },
];
