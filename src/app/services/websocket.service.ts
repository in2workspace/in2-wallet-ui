import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { BehaviorSubject } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private socket!: WebSocket;
  private messageSubject = new BehaviorSubject<string>('');

  public constructor(
    private authenticationService: AuthenticationService,
    private alertController: AlertController
  ) {}

  public connect(): void {
    this.socket = new WebSocket(
      environment.websocket_url + environment.websocket_uri
    );

    this.socket.onopen = () => {
      console.log('Conexión WebSocket abierta');
      this.sendMessage(
        JSON.stringify({ id: this.authenticationService.getToken() })
      );
    };

    this.socket.onmessage = async (event) => {
      console.log('Mensaje recibido:', event.data);
      const data = JSON.parse(event.data);


      let description = '';
      if (data.tx_code && data.tx_code.description) {
        description = data.tx_code.description;
      }

      const alert = await this.alertController.create({
        header: 'Introducir PIN',
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
            text: 'Cancelar',
            role: 'cancel',
          },
          {
            text: 'Enviar',
            handler: (alertData) => {
              this.sendMessage(JSON.stringify({ pin: alertData.pin }));
            },
          },
        ],
      });

      await alert.present();
    };

    this.socket.onclose = () => {
      console.log('Conexión WebSocket cerrada');
    };
  }

  public sendMessage(message: string): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.error('La conexión WebSocket no está abierta.');
    }
  }

  public closeConnection(): void {
    this.socket.close();
  }
}
