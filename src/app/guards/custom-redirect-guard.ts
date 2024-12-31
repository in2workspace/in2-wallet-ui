import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CustomRedirectGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const credentialOfferUri = route.queryParamMap.get('credential_offer_uri');
    if (credentialOfferUri) {
      this.router.navigate(['/tabs/home/openid-credential-offer'], {
        queryParams: { credential_offer_uri: credentialOfferUri },
      });
      return false;
    }
    return true;
  }
}
