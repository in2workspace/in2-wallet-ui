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
  let mockWebSocketInstance: jasmine.SpyObj<WebSocket>;
  let originalWebSocket: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        WebsocketService,
        AuthenticationService,
        { provide: AlertController, useClass: MockAlertController },
        { provide: OidcSecurityService, useClass: MockOidcSecurityService },
      ],
    });

    service = TestBed.inject(WebsocketService);

    originalWebSocket = window.WebSocket;
    mockWebSocketInstance = jasmine.createSpyObj('WebSocket', ['send', 'close'], {
      readyState: WebSocket.OPEN,
    });

    spyOn(window, 'WebSocket').and.returnValue(mockWebSocketInstance);
    spyOn(service, 'sendMessage').and.callThrough();
  });

  afterEach(() => {
    window.WebSocket = originalWebSocket;
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
    const messageEvent = new MessageEvent('message', { data: JSON.stringify({ tx_code: { description: 'Test description' } }) });
    mockWebSocketInstance.onmessage!(messageEvent);
    tick();
    expect(service.sendMessage).toHaveBeenCalledTimes(0);
    flush();
  }));

  it('should log message on WebSocket close', fakeAsync(() => {
    spyOn(console, 'log');
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

  it('should send a message when WebSocket is open', () => {
    service.connect();
    service.sendMessage('Test Message');
    expect(mockWebSocketInstance.send).toHaveBeenCalledWith('Test Message');
  });

  it('should not send a message when WebSocket is not open', () => {
    spyOn(console, 'error');
    const mockWebSocketClosedInstance = jasmine.createSpyObj('WebSocket', ['send', 'close'], {
      readyState: WebSocket.CLOSED,
    });

    service['socket'] = mockWebSocketClosedInstance;

    service.sendMessage('Test Message');
    expect(mockWebSocketClosedInstance.send).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('WebSocket connection is not open.');
  });

  it('should present an alert when a message with tx_code description is received', fakeAsync(() => {
    spyOn(service['alertController'], 'create').and.callThrough();
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
