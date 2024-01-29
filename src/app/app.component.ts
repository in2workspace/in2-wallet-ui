import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from './services/authentication.service';
import { WebsocketService } from './services/web-socket.service';
import { AlertService } from './services/alert.service';
import { environment } from 'src/environments/environment';

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
  
  constructor(public translate: TranslateService,
    private alertService: AlertService
    ) {
    translate.addLangs(['en']);
    translate.setDefaultLang('en');
    this.websocketService.connect(environment.websocker_url);

    this.messageSubscription = this.websocketService
      .getMessageSubject()
      .subscribe(async (message: any) => {
        console.log('Mensaje recibido en otro componente:', message);
        this.presentPinInputAlert();

      });
  }
  logout() {
    this.authenticationService.logout().subscribe(() => {
      this.router.navigate(['/login'], {});
    });
  }
  
  ngOnDestroy() {
    this.messageSubscription.unsubscribe();
  }
  async presentPinInputAlert() {
    const pin = await this.alertService.showPinInputAlert();
    this.websocketService.sendMessage(pin);
  }
}
