import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { KeycloakService } from './keycloak.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  constructor(private authenticationService:AuthenticationService,
    private keycloakService:KeycloakService) { }
  register(userData:any) {
    this.keycloakService.register(userData).subscribe(data=>{
      this.authenticationService.register(userData).subscribe(data=>{})
  })  }
}
