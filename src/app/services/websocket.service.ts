import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { BehaviorSubject } from 'rxjs';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket!: WebSocket;
  private messageSubject = new BehaviorSubject<string>("");

  constructor(  private authenticationService: AuthenticationService,
    private alertController: AlertController

    ) {}

  connect(url: string): void {
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log('Conexión WebSocket abierta');
      this.sendMessage(JSON.stringify({ id: this.authenticationService.getToken() }));
    };

    this.socket.onmessage = async (event) => {
      console.log('Mensaje recibido:', event.data);

      const alert = await this.alertController.create({
        header: 'Introducir PIN',
        inputs: [
          {
            name: 'pin',
            type: 'number',
            placeholder: 'PIN',
          },
        ],
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
          },
          {
            text: 'Enviar',
            handler: (data) => {
              return data.pin;
            },
          },
        ],
      });
  
      await alert.present();
      const result = await alert.onDidDismiss();
       this.sendMessage(JSON.stringify({ pin: result.data?.values.pin || '' }));

    };

    this.socket.onclose = () => {
      console.log('Conexión WebSocket cerrada');
    };
  }

  sendMessage(message: string): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.error('La conexión WebSocket no está abierta.');
    }
  }

  closeConnection(): void {
    this.socket.close();
  }
}