import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

export const logsEnabledGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  if(environment.logs_enabled){
    return true;
  }
  router.navigate(['/settings']);
  return false;
};
