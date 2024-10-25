import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { BehaviorSubject } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';

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
  ) {}

  public connect(): void {
    this.socket = new WebSocket(
      environment.websocket_url + environment.websocket_uri
    );
    console.log('Socket from connect: ')
    console.log(this.socket);

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

      const alert = await this.alertController.create({
        header: this.translate.instant('confirmation.pin'),
        message: description,
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
          },
          {
            text: 'Send',
            handler: (alertData) => {
              this.sendMessage(JSON.stringify({ pin: alertData.pin }));
            },
          },
        ],
      });

      await alert.present();
    };

    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
    };
  }

  public sendMessage(message: string): void {
    console.log('Sending message: ' + message)
    console.warn(this.socket.readyState)
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.log('After readyState check:', this.socket.readyState);
      console.log('After WebSocket.OPEN check: ' + WebSocket.OPEN);
      console.error('WebSocket connection is not open.');
    }
  }

  public closeConnection(): void {
    this.socket.close();
  }
}
