import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from './services/authentication.service';
import { WebsocketService } from './services/web-socket.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    TranslateModule,
  ],
})
export class AppComponent {
  private authenticationService = inject(AuthenticationService);
  private websocketService = inject(WebsocketService);
  private router = inject(Router);

  messageSubscription: any;
  
  constructor(public translate: TranslateService) {
    translate.addLangs(['en']);
    translate.setDefaultLang('en');
    this.messageSubscription = this.websocketService
      .getMessageSubject()
      .subscribe((message: any) => {
        console.log('Mensaje recibido en otro componente:', message);
      });
  }
  logout() {
    this.authenticationService.logout().subscribe(() => {
      this.router.navigate(['/login'], {});
    });
  }
}
