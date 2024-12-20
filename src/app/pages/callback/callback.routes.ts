import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./callback.page').then((m) => m.CallbackPage),
  },
  {
    path: '**',
    redirectTo: '/',
  }
];

export default routes;
