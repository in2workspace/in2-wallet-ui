import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { BehaviorSubject } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { WEBSOCKET_PATH } from '../constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private messageSubject = new BehaviorSubject<string>('');
  private socket!: WebSocket;

  public constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly alertController: AlertController,
    public readonly translate: TranslateService
  ) {}

  public connect(): void {
    this.socket = new WebSocket(
      environment.websocket_url + WEBSOCKET_PATH
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
      let counter = data.timeout || 60;
  
      const alert = await this.alertController.create({
        header: this.translate.instant('confirmation.pin'),
        message: `${description}<br><small class="counter">Time remaining: ${counter} seconds</small>`,
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
  
      const interval = this.startCountdown(alert, description, counter);
  
      await alert.present();
    };
  
    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
    };
  }
  

  public sendMessage(message: string): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.error('WebSocket connection is not open.');
    }
  }

  public closeConnection(): void {
    this.socket.close();
  }

  private startCountdown(
    alert: any,
    description: string,
    initialCounter: number
  ): number {
    let counter = initialCounter;
  
    const interval = window.setInterval(() => {
      if (counter > 0) {
        counter--;
        alert.message = `${description}<br><small class="counter">Time remaining: ${counter} seconds</small>`;
      } else {
        window.clearInterval(interval);
        alert.dismiss();
      }
    }, 1000);
  
    return interval;
  }
  
}
