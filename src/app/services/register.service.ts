import { Injectable, inject } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { KeycloakService } from './keycloak.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private authenticationService=inject(AuthenticationService);
    private keycloakService=inject(KeycloakService);
  constructor() { }
  register(userData:any) {
    this.keycloakService.register(userData).subscribe(data=>{
      this.authenticationService.register(userData).subscribe(data=>{})
  })  }
}
