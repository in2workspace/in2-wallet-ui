import { TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { WebsocketService } from './websocket.service';
import { AuthenticationService } from './authentication.service';
import { AlertController } from '@ionic/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TranslateModule } from '@ngx-translate/core';

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
  let mockAlertController: MockAlertController;
  let mockWebSocketInstance: jest.Mocked<any>;
  let originalWebSocket: any;

  beforeEach(() => {
    mockAlertController = new MockAlertController();

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        WebsocketService,
        AuthenticationService,
        { provide: AlertController, useValue: mockAlertController },
        { provide: OidcSecurityService, useClass: MockOidcSecurityService },
      ],
    });

    service = TestBed.inject(WebsocketService);

    originalWebSocket = window.WebSocket;
    mockWebSocketInstance = {
      send: jest.fn().mockImplementation((str:string) =>str),
      close: jest.fn(),
      readyState: WebSocket.OPEN,
      onmessage: null,
      onclose: null,
      onopen: null,
    };
    
    jest.spyOn(service, 'sendMessage');
    jest.spyOn(window, 'WebSocket').mockImplementation((url: string | URL, protocols?: string | string[] | undefined) => mockWebSocketInstance);
    (window as any).WebSocket.OPEN = 1;
    (window as any).WebSocket.CLOSED = 3;
    (window as any).WebSocket.CONNECTING = 0;
    (window as any).WebSocket.CLOSING = 2;
  });

  afterEach(() => {
    window.WebSocket = originalWebSocket;
  });

  it('should create and open a WebSocket connection', fakeAsync(() => {
    service.connect();
    tick();
    expect(window.WebSocket).toHaveBeenCalledWith(`${environment.websocket_url}${environment.websocket_uri}`);
    expect(service.sendMessage).not.toHaveBeenCalled();
    flush();
  }));

  it('should handle incoming messages and present an alert', fakeAsync(() => {
    service.connect();
    tick();
    const messageEvent = new MessageEvent('message', { data: JSON.stringify({ tx_code: { description: 'Test description' } }) });
    mockWebSocketInstance.onmessage!(messageEvent);
    tick();
    expect(service.sendMessage).not.toHaveBeenCalled();
    flush();
  }));

  it('should log message on WebSocket close', fakeAsync(() => {
    jest.spyOn(console, 'log');
    service.connect();
    tick();
    mockWebSocketInstance.onclose!(new CloseEvent('close'));
    expect(console.log).toHaveBeenCalledWith('WebSocket connection closed');
  }));

  it('should close WebSocket connection on closeConnection call', () => {
    service.connect();
    service.closeConnection();
    expect(mockWebSocketInstance.close).toHaveBeenCalledTimes(1);
  });

  it('should send a message when WebSocket is open', fakeAsync(() => {
    service.connect();

    tick();
    service.sendMessage('Test Message');
    expect((service as any).socket.send).toHaveBeenCalledWith('Test Message');
  }));

  it('should not send a message when WebSocket is not open', () => {
    jest.spyOn(console, 'error');
    const mockWebSocketClosedInstance = {
      send: jest.fn(),
      close: jest.fn(),
      readyState: WebSocket.CLOSED,
    };

    service['socket'] = mockWebSocketClosedInstance as any;

    service.sendMessage('Test Message');
    expect(mockWebSocketClosedInstance.send).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('WebSocket connection is not open.');
  });

  it('should present an alert when a message with tx_code description is received', fakeAsync(() => {
    jest.spyOn(mockAlertController, 'create').mockImplementation(() => {
      return Promise.resolve({
        present: jest.fn(),
        onDidDismiss: jest.fn().mockResolvedValue({ data: { values: { pin: '1234' } } }),
      });
    });
    service.connect();
    tick();
    const messageEvent = new MessageEvent('message', { data: JSON.stringify({ tx_code: { description: 'Test description' } }) });
    mockWebSocketInstance.onmessage!(messageEvent);
    tick();
    expect(service['alertController'].create).toHaveBeenCalled();
    flush();
  }));

  it('should handle WebSocket onopen event', fakeAsync(() => {
    service.connect();
    tick();
    const event = new Event('open');
    mockWebSocketInstance.onopen!(event);
    tick();
    expect(mockWebSocketInstance.send).toHaveBeenCalledWith(JSON.stringify({ id: 'fake-token' }));
    flush();
  }));
});
