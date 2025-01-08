import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { BehaviorSubject } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { ToastServiceHandler } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private socket!: WebSocket;
  private messageSubject = new BehaviorSubject<string>('');

  public constructor(
    private authenticationService: AuthenticationService,
    private alertController: AlertController,
    public translate: TranslateService,
    private toastService: ToastServiceHandler
  ) {}

  public connect(): void {
    this.socket = new WebSocket(
      environment.websocket_url + environment.websocket_uri
    );
  
    this.socket.onopen = () => {
      console.log('WebSocket connection opened');
      this.sendMessage(
        JSON.stringify({ id: this.authenticationService.getToken() })
      );
    };
  
    this.socket.onmessage = async (event) => {
      console.log('Message received:', event.data);
      const data = JSON.parse(event.data);
  
      let description = data.tx_code?.description || '';
  
      if (data.tx_code?.description) {
        description = data.tx_code.description;
      }
  
      let counter = 60; //todo get from backend
      const alert = await this.alertController.create({
        header: this.translate.instant('confirmation.pin'),
        message: `${description}<br>Time remaining: ${counter} seconds`,
        inputs: [
          {
            name: 'pin',
            type: 'text',
            placeholder: 'PIN',
            attributes: {
              inputmode: 'numeric',
              pattern: '[0-9]*',
            },
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              clearInterval(interval);
            },
          },
          {
            text: 'Send',
            handler: (alertData) => {
              clearInterval(interval);
              this.sendMessage(JSON.stringify({ pin: alertData.pin }));
            },
          },
        ],
      });
  
      const interval = setInterval(() => {
        if (counter > 0) {
          counter--;
          alert.message = `${description}<br>Time remaining: ${counter} seconds`;
        } else {
          clearInterval(interval);
          alert.dismiss();
          this.toastService.showErrorAlert("PIN expired");
        }
      }, 1000);
  
      await alert.present();
    };
  
    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
    };
  }
  

  public sendMessage(message: string): void {
    console.log('my websocket'); //todo remove debug console
    console.log(this.socket);
    console.log('websocket.open');
    console.log(WebSocket.OPEN);
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.error('WebSocket connection is not open.');
    }
  }

  public closeConnection(): void {
    this.socket.close();
  }
}
