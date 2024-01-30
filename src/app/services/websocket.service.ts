import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket!: WebSocket;
  private messageSubject = new BehaviorSubject<string>("");

  constructor(  private authenticationService: AuthenticationService,
    ) {}

  connect(url: string): void {
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log('Conexión WebSocket abierta');
      this.sendMessage(JSON.stringify({ id: this.authenticationService.token }));
    };

    this.socket.onmessage = (event) => {
      console.log('Mensaje recibido:', event.data);
    };

    this.socket.onclose = () => {
      console.log('Conexión WebSocket cerrada');
    };
  }

  getMessageSubject() {
    return this.messageSubject.asObservable();
  }
  
  private handleIncomingMessage(message: string) {
    this.messageSubject.next(message);
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