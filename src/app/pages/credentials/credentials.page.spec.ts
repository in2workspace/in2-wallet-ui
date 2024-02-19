import { ComponentFixture, TestBed, async, waitForAsync, fakeAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { CredentialsPage } from './credentials.page';
import { WalletService } from 'src/app/services/wallet.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { DataService } from 'src/app/services/data.service';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('CredentialsPage', () => {
  let component: CredentialsPage;
  let fixture: ComponentFixture<CredentialsPage>;
  let walletServiceSpy: jasmine.SpyObj<WalletService>;
  let websocketServiceSpy: jasmine.SpyObj<WebsocketService>;
  let authServiceSpy: jasmine.SpyObj<AuthenticationService>;
  let httpTestingController: HttpTestingController;
  const mockedStats = '';

  beforeEach(waitForAsync(() => {
    walletServiceSpy = jasmine.createSpyObj('WalletService', ['requestCredential']);
    websocketServiceSpy = jasmine.createSpyObj('WebsocketService', ['connect']);
    const dataServiceSpyObj = jasmine.createSpyObj('DataService', ['listenDid']);
    const authServiceSpyObj = jasmine.createSpyObj('AuthenticationService', ['getName']);
    dataServiceSpyObj.listenDid.and.returnValue(of(''));

    TestBed.configureTestingModule({
      //declarations: [CredentialsPage],
      imports: [
        IonicModule.forRoot(),
        TranslateModule.forRoot(),
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: WalletService, useValue: walletServiceSpy },
        { provide: WebsocketService, useValue: websocketServiceSpy },
        { provide: DataService, useValue: dataServiceSpyObj },
        { provide: AuthenticationService, useValue: authServiceSpyObj },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ credentialOfferUri: 'mockCredentialOfferUri' }),
          },
        },
      ],
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    //authServiceSpy = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;
    //dataServiceSpy = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;
    fixture = TestBed.createComponent(CredentialsPage);
    component = fixture.componentInstance;
    }));


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*it('should call generateCred and refresh when requestCredential is successful', waitForAsync(() => {
    const executionResponseMock = 'mockExecutionResponse';
    walletServiceSpy.requestCredential.and.returnValue(of(executionResponseMock));

    component.generateCred();

    expect(websocketServiceSpy.connect).toHaveBeenCalledWith(
      environment.websocket.url + environment.websocket.uri
    );
    expect(walletServiceSpy.requestCredential).toHaveBeenCalledWith('mockCredentialOfferUri');
    expect(component.refresh).toHaveBeenCalled();
  }));

  it('should handle error when requestCredential fails', waitForAsync(() => {
    walletServiceSpy.requestCredential.and.throwError('Error');

    component.generateCred();

    expect(websocketServiceSpy.connect).toHaveBeenCalledWith(
      environment.websocket.url + environment.websocket.uri
    );
    expect(walletServiceSpy.requestCredential).toHaveBeenCalledWith('mockCredentialOfferUri');
    expect(component.refresh).not.toHaveBeenCalled();
  }));*/
});
