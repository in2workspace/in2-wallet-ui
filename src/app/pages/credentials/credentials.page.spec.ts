import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { CredentialsPage } from './credentials.page';
import { WalletService } from 'src/app/services/wallet.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { DataService } from 'src/app/services/data.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { VerifiableCredential } from 'src/app/interfaces/verifiable-credential';

describe('CredentialsPage', () => {
  let component: CredentialsPage;
  let fixture: ComponentFixture<CredentialsPage>;
  let walletServiceSpy: jasmine.SpyObj<WalletService>;
  let websocketServiceSpy: jasmine.SpyObj<WebsocketService>;
  let httpTestingController: HttpTestingController;
  let router: Router;

  const TIME_IN_MS = 10000;

  beforeEach(waitForAsync(() => {
    walletServiceSpy = jasmine.createSpyObj('WalletService', ['getAllVCs', 'requestCredential', 'deleteVC', 'executeContent']);
    websocketServiceSpy = jasmine.createSpyObj('WebsocketService', ['connect']);
    const dataServiceSpyObj = jasmine.createSpyObj('DataService', ['listenDid']);
    const authServiceSpyObj = jasmine.createSpyObj('AuthenticationService', ['getName']);
    walletServiceSpy.requestCredential.and.returnValue(of({}));

    dataServiceSpyObj.listenDid.and.returnValue(of('someDidValue'));
    walletServiceSpy.executeContent.and.returnValue(of({}));
    walletServiceSpy.requestCredential.and.returnValue(of(null));

    TestBed.configureTestingModule({
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
    fixture = TestBed.createComponent(CredentialsPage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  }));


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should enable scan mode when scan is called', () => {
    component.scan();
    expect(component.toggleScan).toBeTrue();
    expect(component.show_qr).toBeTrue();
    expect(component.ebsiFlag).toBeFalse();
  });

  it('should copy "did-text" to clipboard when copyToClipboard is called with "did-text"', async () => {
    spyOn(navigator.clipboard, 'writeText');

    const didText = 'DID: exampleDid';
    const expectedClipboardContent = 'exampleDid';
    document.body.innerHTML = `<div id="did-text">${didText}</div>`;

    await component.copyToClipboard('did-text');

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expectedClipboardContent);
  });

  it('should handle error gracefully if clipboard API fails', async () => {
    spyOn(navigator.clipboard, 'writeText').and.rejectWith('Test error');
    spyOn(console, 'error');

    const didTextContent = 'DID: exampleDid';
    document.body.innerHTML = `<div id="did-text">${didTextContent}</div>`;

    await component.copyToClipboard('did-text');

    expect(console.error).toHaveBeenCalledWith('Error al copiar texto al portapapeles:', 'Test error');
  });

  it('should generate credential when generateCred is called', () => {
    const mockCredentialOfferUri = 'mockCredentialOfferUri';

    walletServiceSpy.requestCredential.and.returnValue(of());

    component.credentialOfferUri = mockCredentialOfferUri;
    component.generateCred();

    expect(walletServiceSpy.requestCredential).toHaveBeenCalledWith(mockCredentialOfferUri);
  });

  it('should update the credential list when refresh is called', fakeAsync(() => {
    const mockCredList: VerifiableCredential[] = [
      {
        "@context": ["https://www.w3.org/ns/credentials/v2"],
        "id": "1",
        "type": ["VerifiableCredential", "SomeType"],
        "issuer": {
          "id": "issuerId1"
        },
        "issuanceDate": "2021-01-01T00:00:00Z",
        "validFrom": "2021-01-01T00:00:00Z",
        "expirationDate": "2025-12-31T23:59:59Z",
        "credentialSubject": {
          "mandate": {
            "id": "mandateId1",
            "mandator": {
              "organizationIdentifier": "orgId1",
              "commonName": "Common Name",
              "emailAddress": "email@example.com",
              "serialNumber": "serialNumber1",
              "organization": "Organization Name",
              "country": "Country"
            },
            "mandatee": {
              "id": "personId1",
              "first_name": "First",
              "last_name": "Last",
              "gender": "Gender",
              "email": "email@example.com",
              "mobile_phone": "+1234567890"
            },
            "power": [
              {
                "id": "powerId1",
                "tmf_type": "Domain",
                "tmf_domain": ["SomeDomain"],
                "tmf_function": "SomeFunction",
                "tmf_action": ["SomeAction"]
              }
            ],
            "life_span": {
              "start_date_time": "2021-01-01T00:00:00Z",
              "end_date_time": "2025-12-31T23:59:59Z"
            }
          }
        }
      }
    ];

    walletServiceSpy.getAllVCs.and.returnValue(of(mockCredList));

    component.refresh();
    tick();

    expect(component.credList).toEqual(mockCredList.reverse());
  }));



  it('credentialClick should navigate after a delay', fakeAsync(() => {
    const routerSpy = TestBed.inject(Router);
    spyOn(routerSpy, 'navigate');
    component.credentialClick();
    tick(TIME_IN_MS);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/tabs/credentials/']);
  }));

  it('vcDelete should call deleteVC on the wallet service with the correct ID and refresh the list', () => {
    const testCredential: VerifiableCredential = {
      "@context": ["https://www.w3.org/ns/credentials/v2"],
      "id": "testCredentialId",
      "type": ["VerifiableCredential", "SomeType"],
      "issuer": {
        "id": "issuerId1"
      },
      "issuanceDate": "2024-04-02T09:23:22.637345122Z",
      "validFrom": "2024-04-02T09:23:22.637345122Z",
      "expirationDate": "2025-04-02T09:23:22.637345122Z",
      "credentialSubject": {
        "mandate": {
          "id": "mandateId1",
          "mandator": {
            "organizationIdentifier": "orgId1",
            "commonName": "Common Name",
            "emailAddress": "email@example.com",
            "serialNumber": "serialNumber1",
            "organization": "Organization Name",
            "country": "Country"
          },
          "mandatee": {
            "id": "personId1",
            "first_name": "First",
            "last_name": "Last",
            "gender": "Gender",
            "email": "email@example.com",
            "mobile_phone": "+1234567890"
          },
          "power": [
            {
              "id": "powerId1",
              "tmf_type": "Domain",
              "tmf_domain": ["SomeDomain"],
              "tmf_function": "SomeFunction",
              "tmf_action": ["SomeAction"]
            }
          ],
          "life_span": {
            "start_date_time": "2024-04-02T09:23:22.637345122Z",
            "end_date_time": "2025-04-02T09:23:22.637345122Z"
          }
        }
      }
    };

    walletServiceSpy.deleteVC.and.returnValue(of('Success'));
    spyOn(component, 'refresh');
    component.vcDelete(testCredential);
    expect(walletServiceSpy.deleteVC).toHaveBeenCalledWith(testCredential.id);
    expect(component.refresh).toHaveBeenCalled();
  });


  it('ngOnInit should initialize component properties and call refresh', () => {
    spyOn(component, 'refresh');
    component.ngOnInit();
    expect(component.scaned_cred).toBeFalse();
    expect(component.refresh).toHaveBeenCalled();
  });

  it('qrCodeEmit should process QR code and potentially change state or call services', fakeAsync(() => {
    spyOn(router, 'navigate');
    const testQrCode = "someTestQrCode";
    component.qrCodeEmit(testQrCode);
    tick();

    expect(router.navigate).toHaveBeenCalledWith(['/tabs/vc-selector/'], { queryParams: { executionResponse: JSON.stringify({}) } });
  }));
});
