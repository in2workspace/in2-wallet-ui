import { fakeAsync, flush, TestBed } from '@angular/core/testing';
import { IonicModule, AlertController } from '@ionic/angular';
import { CredentialsPage } from './credentials.page';
import { ChangeDetectorRef, DestroyRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WalletService } from 'src/app/services/wallet.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { CameraLogsService } from 'src/app/services/camera-logs.service';
import { ToastServiceHandler } from 'src/app/services/toast.service';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { CredentialStatus, CredentialStatusType, Mandate, VerifiableCredential } from 'src/app/interfaces/verifiable-credential';
import { TranslateService } from '@ngx-translate/core';

describe('CredentialsPage', () => {
  let component: CredentialsPage;
  let walletServiceMock: any;
  let routerMock: any;
  let toastServiceHandlerMock: any;

  beforeEach(async () => {
    walletServiceMock = {
      requestSignature: jest.fn(),
      getAllVCs: jest.fn(),
    };

    routerMock = {
      navigate: jest.fn(() => Promise.resolve(true)),
    };

    toastServiceHandlerMock = {
      showErrorAlert: jest.fn(() => of(true)),
    };

    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot()],
      providers: [
        CredentialsPage,
        { provide: WalletService, useValue: walletServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ToastServiceHandler, useValue: toastServiceHandlerMock },
        { provide: AlertController, useValue: { create: jest.fn(() => Promise.resolve({ present: jest.fn(), dismiss: jest.fn() })) } },
        { provide: ChangeDetectorRef, useValue: { detectChanges: jest.fn() } },
        { provide: DestroyRef, useValue: {} },
        { provide: ActivatedRoute, useValue: { queryParams: of({}) } },
        { provide: WebsocketService, useValue: { connect: jest.fn(), closeConnection: jest.fn() } },
        { provide: CameraLogsService, useValue: {} },
        { provide: TranslateService, useValue: { instant: (key: string) => key } }
      ],

    }).compileComponents();

    component = TestBed.inject(CredentialsPage);
    component.credList = [];
    component.refresh = jest.fn();
    component.generateCred = jest.fn();
    component.forcePageReload = jest.fn();
  });

  describe('ngOnInit', () => {
    it('should call generateCred only if credentialOfferUri is not null',() => {
      component.credentialOfferUri = 'testUri';
      component.ngOnInit();
      expect(component.generateCred).toHaveBeenCalledTimes(1);
      expect(component.refresh).toHaveBeenCalled();
      expect(component.scaned_cred).toBe(false);
    });
    it('should not call generateCred only if credentialOfferUri is null',() => {
      component.credentialOfferUri = '';
      component.ngOnInit();
      expect(component.generateCred).not.toHaveBeenCalled();
      expect(component.refresh).toHaveBeenCalled();
      expect(component.scaned_cred).toBe(false);
    });
  });
  describe('ionViewerDidEnter', () => {
    it('should call requestPendingSignatures when refreshing or entering endpoint', fakeAsync(() => {
      const requestPendingSignaturesSpy = jest.spyOn(component as any, 'requestPendingSignatures');

      component.ionViewDidEnter();
      flush();
      expect(requestPendingSignaturesSpy).toHaveBeenCalled();
    }));
  });

  describe('requestPendingSignatures', () => {
    beforeEach(() => {
        component.credList = [];
    });
    it('should not take any action if there are no credentials on the wallet', () => {
      component.credList = []; 
      (component as any).requestPendingSignatures(); 

      expect(walletServiceMock.requestSignature).not.toHaveBeenCalled();
    });

    it('should not take any action if there are no outstanding credentials (ISSUED)', () => {
      const credential: VerifiableCredential = {lifeCycleStatus: CredentialStatusType.REVOKED} as VerifiableCredential;
      component.credList = [credential]; 
      (component as any).requestPendingSignatures(); 

      expect(walletServiceMock.requestSignature).not.toHaveBeenCalled();
    });

    it('should process pending credentials and call forcePageReload if any response is successful', fakeAsync(() => {
      const mockMandate = {
        id: '123',
      } as Mandate
      const pendingCredential = {
        id: '123',
        lifeCycleStatus: CredentialStatusType.ISSUED,
        '@context': ['https://www.w3.org/ns/credentials/v2'],
        issuer: { id: 'issuer' },
        issuanceDate: new Date().toISOString(),
        validFrom: new Date().toISOString(),
        type: ['VerifiableCredential'],
        credentialSubject: { mandate:  mockMandate},
        expirationDate: new Date().toISOString(),
        validUntil: new Date().toISOString(),
        credentialStatus: {} as CredentialStatus,
      };
      component.credList = [pendingCredential];

      const response: HttpResponse<string> = { status: 204 } as HttpResponse<string>;
      walletServiceMock.requestSignature.mockReturnValue(of(response));

      component.forcePageReload = jest.fn();

      (component as any).requestPendingSignatures();
      flush(); 

      expect(walletServiceMock.requestSignature).toHaveBeenCalledWith('123');
      expect(component.forcePageReload).toHaveBeenCalled();
    }));

    it('should handle errors in requestSignature and not call toastServiceHandler.showErrorAlert or forcePageReload', fakeAsync(() => {
        const mockMandate = {
            id: '456',
          } as Mandate
          const pendingCredential = {
            id: '456',
            lifeCycleStatus: CredentialStatusType.ISSUED,
            '@context': ['https://www.w3.org/ns/credentials/v2'],
            issuer: { id: 'issuer' },
            issuanceDate: new Date().toISOString(),
            validFrom: new Date().toISOString(),
            type: ['VerifiableCredential'],
            credentialSubject: { mandate:  mockMandate},
            expirationDate: new Date().toISOString(),
            validUntil: new Date().toISOString(),
            credentialStatus: {} as CredentialStatus,

          };
      component.credList = [pendingCredential];

      const errorResponse = new HttpErrorResponse({
        error: { message: 'error message', title: 'Error Title', path: '/error' },
        status: 500,
      });
      walletServiceMock.requestSignature.mockReturnValue(throwError(() => errorResponse));

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      component.forcePageReload = jest.fn();

      (component as any).requestPendingSignatures();
      flush();

      expect(walletServiceMock.requestSignature).toHaveBeenCalledWith('456');
      expect(toastServiceHandlerMock.showErrorAlert).not.toHaveBeenCalled();
      expect(component.forcePageReload).not.toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    }));
  });

  describe('forcePageReload', () => {
    it('should navigate to /tabs/credentials and reload the window', async () => {
      component.forcePageReload = CredentialsPage.prototype.forcePageReload.bind(component);

      const reloadSpy = jest.fn();
      const originalLocation = window.location;
      // @ts-ignore
      delete window.location;
      // @ts-ignore
      window.location = { ...originalLocation, reload: reloadSpy };

      routerMock.navigate.mockReturnValue(Promise.resolve(true));

      await component.forcePageReload();

      expect(routerMock.navigate).toHaveBeenCalledWith(['/tabs/credentials']);
      expect(reloadSpy).toHaveBeenCalled();

      window.location = originalLocation as any;
    });
  });
});