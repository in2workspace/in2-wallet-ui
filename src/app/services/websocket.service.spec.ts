import { TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { WebsocketService } from './websocket.service';
import { AuthenticationService } from './authentication.service';
import { AlertController } from '@ionic/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';

class MockOidcSecurityService {
  checkAuth() {
    return of({ userData: {}, accessToken: 'fake-token' });
  }

  getToken() {
    return 'fake-token';
  }

  logoff() {}
}

class MockAlertController {
  create() {
    return Promise.resolve({
      present: () => Promise.resolve(),
      onDidDismiss: () => Promise.resolve({ data: { values: { pin: '1234' } } }),
    });
  }
}

describe('WebsocketService', () => {
  let service: WebsocketService;
  let mockWebSocketInstance: WebSocket;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        WebsocketService,
        AuthenticationService,
        { provide: AlertController, useClass: MockAlertController },
        { provide: OidcSecurityService, useClass: MockOidcSecurityService },
      ],
    });

    service = TestBed.inject(WebsocketService);

    mockWebSocketInstance = new WebSocket(environment.websocket_url);

    spyOn(window, 'WebSocket').and.returnValue(mockWebSocketInstance);
    spyOn(mockWebSocketInstance, 'send');
    spyOn(mockWebSocketInstance, 'close');


    spyOn(service, 'sendMessage').and.callThrough();
  });

  it('should create and open a WebSocket connection', fakeAsync(() => {
    service.connect();
    tick();

    expect(window.WebSocket).toHaveBeenCalledWith(`${environment.websocket_url}${environment.websocket_uri}`);
    expect(service.sendMessage).toHaveBeenCalledTimes(0);
    flush();
  }));

  it('should handle incoming messages and present an alert', fakeAsync(() => {
    service.connect();
    tick();

    const messageEvent = new MessageEvent('message', { data: JSON.stringify({ someData: 'Test message' }) });
    mockWebSocketInstance.onmessage!(messageEvent);
    tick();

    expect(service.sendMessage).toHaveBeenCalledTimes(1);
    flush();
  }));

  it('should log message on WebSocket close', fakeAsync(() => {
    spyOn(console, 'log');
    service.connect();
    tick();

    mockWebSocketInstance.onclose!(new CloseEvent('close'));
    expect(console.log).toHaveBeenCalledWith('Conexión WebSocket cerrada');
  }));

  it('should close WebSocket connection on closeConnection call', () => {
    service.connect();
    service.closeConnection();

    expect(mockWebSocketInstance.close).toHaveBeenCalledTimes(1);
  });

});
