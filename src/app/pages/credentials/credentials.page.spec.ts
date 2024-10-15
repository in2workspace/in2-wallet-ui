import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { AlertController, IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CredentialsPage } from './credentials.page';
import { WalletService } from 'src/app/services/wallet.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { DataService } from 'src/app/services/data.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CredentialStatus, VerifiableCredential } from 'src/app/interfaces/verifiable-credential';
import { Storage } from '@ionic/storage-angular';
import { CallbackPage } from '../callback/callback.page';


const writeText = jest.fn()
Object.assign(navigator, {
  clipboard: {
    writeText,
  },
});
describe('CredentialsPage', () => {
  let component: CredentialsPage;
  let fixture: ComponentFixture<CredentialsPage>;
  let walletServiceSpy: jest.Mocked<WalletService>;
  let websocketServiceSpy: jest.Mocked<WebsocketService>;
  let httpTestingController: HttpTestingController;
  let router: Router;


  const TIME_IN_MS = 10000;


  beforeEach(waitForAsync(() => {
   
    walletServiceSpy = {
      getAllVCs: jest.fn().mockReturnValue(of([])),
      requestCredential: jest.fn().mockReturnValue(of({} as any)),
      deleteVC: jest.fn(),
      executeContent: jest.fn().mockReturnValue(of({} as any))
    } as unknown as jest.Mocked<WalletService>;


    websocketServiceSpy = {
      connect: jest.fn()
    } as unknown as jest.Mocked<WebsocketService>;


    const dataServiceSpyObj = {
      listenDid: jest.fn().mockReturnValue(of('someDidValue'))
    } as unknown as jest.Mocked<DataService>;


    const authServiceSpyObj = {
      getName: jest.fn()
    } as unknown as jest.Mocked<AuthenticationService>;


    TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(),
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([{path:'tabs/vc-selector', component:CallbackPage}]),
        HttpClientTestingModule
      ],
      providers: [
        Storage,
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
    expect(component.toggleScan).toBe(true);
    expect(component.show_qr).toBe(true);
    expect(component.ebsiFlag).toBe(false);
  });


  // TODO
  // it('should copy "did-text" to clipboard when copyToClipboard is called with "did-text"', fakeAsync(() => {


  //   const writeClipboardSpy = jest.spyOn(navigator.clipboard, 'writeText').mockResolvedValue();
  //   const didText = 'DID: exampleDid';
  //   const expectedClipboardContent = 'exampleDid';
  //   document.body.innerHTML = `<div id="did-text">${didText}</div>`;
 
  //   component.copyToClipboard('did-text');
  //   tick();
  //   expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expectedClipboardContent);
  // }));
 
  // it('should handle error if clipboard API fails', fakeAsync( () => {
  //   const originalWriteText = navigator.clipboard?.writeText;
  //   Object.assign(navigator, {
  //     clipboard: {
  //       writeText: jest.fn(),
  //     },
  //   });
  //   // Mock the clipboard API to fail
  //   jest.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error);
  //   jest.spyOn(console, 'error').mockImplementation(() => {});
 
  //   // Set up the component state for `did-text` to render
  //   component.ebsiFlag = true;  // This will conditionally render did-text
  //   component.did = 'exampleDid';  // This simulates a DID value
 
  //   // Trigger Angular to update the DOM
  //   tick(1000);
  //   fixture.detectChanges();
 
  //   // Get the rendered element from Angular's DOM
  //   const didTextElement = document.getElementById('did-text');
 
  //   // Make sure the element exists and has text
  //   expect(didTextElement).not.toBeNull();
  //   expect(didTextElement?.innerHTML?.trim()).toContain('exampleDid');
 
  //   // Call the method being tested
  //   component.copyToClipboard('did-text');
  //   tick();
 
  //   // Check that the error was logged as expected
  //   expect(console.error).toHaveBeenCalledWith('Error al copiar texto al portapapeles:', 'Test error');


  //   Object.assign(navigator, {
  //     clipboard: {
  //       writeText: originalWriteText,
  //     },
  //   });
  // }));
 


  it('should generate credential when generateCred is called', () => {
    const mockCredentialOfferUri = 'mockCredentialOfferUri';


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
        "issuer": { "id": "issuerId1" },
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
        },
        status: CredentialStatus.ISSUED
      }
    ];


    walletServiceSpy.getAllVCs.mockReturnValue(of(mockCredList));


    component.refresh();
    tick();


    expect(component.credList).toEqual(mockCredList.reverse());
  }));


  it('vcDelete should call deleteVC on the wallet service with the correct ID and refresh the list', () => {
    const testCredential: VerifiableCredential = {
      "@context": ["https://www.w3.org/ns/credentials/v2"],
      "id": "testCredentialId",
      "type": ["VerifiableCredential", "SomeType"],
      "issuer": { "id": "issuerId1" },
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
      },
      status: CredentialStatus.ISSUED
    };


    walletServiceSpy.deleteVC.mockReturnValue(of('Success'));
    jest.spyOn(component, 'refresh');
    component.vcDelete(testCredential);
    expect(walletServiceSpy.deleteVC).toHaveBeenCalledWith(testCredential.id);
    expect(component.refresh).toHaveBeenCalled();
  });


  it('ngOnInit should initialize component properties and call refresh', () => {
    walletServiceSpy.getAllVCs.mockReturnValue(of([]));
    jest.spyOn(component, 'refresh');
    component.ngOnInit();
    expect(component.scaned_cred).toBe(false);
    expect(component.refresh).toHaveBeenCalled();
  });


  it('qrCodeEmit should process QR code and potentially change state or call services', fakeAsync(() => {
    jest.spyOn(router, 'navigate');
    const testQrCode = "someTestQrCode";
    component.qrCodeEmit(testQrCode);
    tick();


    expect(router.navigate).toHaveBeenCalledWith(['/tabs/vc-selector/'], { queryParams: { executionResponse: JSON.stringify({}) } });
  }));




  it('should log error to cameraLogsService when executeContent fails', fakeAsync(() => {
    // Arrange
    const mockErrorResponse = {
      error: {
        title: 'Test Error Title',
        message: 'Test Error Message',
        path: '/test/error/path'
      }
    };
    const errorMessage = `${mockErrorResponse.error.title} . ${mockErrorResponse.error.message} . ${mockErrorResponse.error.path}`;
 
    // Simulem un error quan s'executa executeContent
    jest.spyOn(walletServiceSpy, 'executeContent').mockReturnValueOnce(throwError(() => mockErrorResponse));
 
    const addCameraLogSpy = jest.spyOn((component as any).cameraLogsService, 'addCameraLog');
 
    // Act
    component.qrCodeEmit('someQrCode');
    tick();
 
    // Assert
    expect(component.toggleScan).toBe(true); // Verifica que es torni a habilitar l'escaneig
    expect(addCameraLogSpy).toHaveBeenCalledWith(new Error(errorMessage), 'httpError');
  }));
 
 


  it('should handle alert Cancel correctly', fakeAsync(() => {
    const alertController = TestBed.inject(AlertController);
    jest.spyOn(alertController, 'create').mockResolvedValue({
      present: () => Promise.resolve(),
      buttons: [
        { text: 'Cancelar', role: 'cancel', handler: () => {} },
        { text: 'Aceptar', handler: () => {} }
      ]
    } as any);


    component.credentialClick();
    tick();
  }));


  it('should handle alert Accept correctly', fakeAsync(() => {
    const alertController = TestBed.inject(AlertController);
    jest.spyOn(alertController, 'create').mockResolvedValue({
      present: () => Promise.resolve(),
      buttons: [
        { text: 'Cancelar', role: 'cancel', handler: () => {} },
        { text: 'Aceptar', handler: () => {} }
      ]
    } as any);


    component.credentialClick();
    tick();
  }));
});



