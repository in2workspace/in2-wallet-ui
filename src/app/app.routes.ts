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
    loadChildren: () => import('./pages/callback/callback.routes').then(m => m.default),
  },
  {
    path: '**',
    redirectTo: '/',
  },
];
