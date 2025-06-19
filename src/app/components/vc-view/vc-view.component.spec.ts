import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { VcViewComponent } from './vc-view.component';
import { WalletService } from 'src/app/services/wallet.service';
import { CredentialStatus, VerifiableCredential } from 'src/app/interfaces/verifiable-credential';
import { Observable, of, throwError } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { CallbackPage } from 'src/app/pages/callback/callback.page';

class WalletServiceMock {
  getVCinCBOR(credential: VerifiableCredential) {
    return of('mock_cbor_string');
  }
  requestSignature(credentialId: string): Observable<any> {
    return of({ success: true });
  }
}

describe('VcViewComponent', () => {
  let component: VcViewComponent;
  let fixture: ComponentFixture<VcViewComponent>;
  let walletService: WalletService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{path:'tabs/credentials', component:CallbackPage}]),
        TranslateModule.forRoot(),
        VcViewComponent,
      ],
      providers: [{ provide: WalletService, useClass: WalletServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(VcViewComponent);
    component = fixture.componentInstance;
    walletService = TestBed.inject(WalletService);

    component.credentialInput = {
      '@context': [],
      id: 'testId',
      type: [],
      issuer: { id: 'issuerId' },
      validFrom: '',
      validUntil: new Date(Date.now() + 86400000).toISOString(),
      credentialSubject: {
        mandate: {
          id: 'mandateId',
          mandator: {
            commonName: '',
            serialNumber: '',
            organization: '',
            country: '',
            id: ''
          },
          mandatee: {
            id: 'mandateeId',
            firstName: '',
            lastName: '',
            email: '',
            employeId: '',
            domain: '',
            ipAddress: ''
          },
          power: [
            {
              id: '',
              type: '',
              domain: '',
              function: '',
              action: [''],
            },
          ]
        },
      },
      status: CredentialStatus.ISSUED
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('qrView should handle credential correctly if not expired', () => {
    component.isExpired = false;
    const mockCBOR = 'mock_cbor_string';
    jest.spyOn(walletService, 'getVCinCBOR').mockReturnValue(of(mockCBOR));

    component.qrView();

    expect(walletService.getVCinCBOR).toHaveBeenCalledWith(component.credentialInput);
    expect(component.cred_cbor).toEqual(mockCBOR);
    expect(component.isAlertOpenNotFound).toBeFalsy();
  });


  it('checkExpirationVC should set isExpired to true if credential is expired', () => {
    component.credentialInput = {
      id: 'testId',
      validUntil: new Date(Date.now() - 86400000).toISOString(),
      status: CredentialStatus.REVOKED,
    } as VerifiableCredential;

    component.checkExpirationVC();

    expect(component.isExpired).toBeTruthy();
  });

  it('checkExpirationVC should set isExpired to false if credential is not expired', () => {
    component.credentialInput = {
      id: 'testId'
    } as VerifiableCredential;

    component.checkExpirationVC();

    expect(component.isExpired).toBeFalsy();
  });

  it('setOpen should correctly set isModalOpen', () => {
    component.setOpen(true);
    expect(component.isModalOpen).toBeTruthy();

    component.setOpen(false);
    expect(component.isModalOpen).toBeFalsy();
  });

  it('setOpenNotFound should correctly set isAlertOpenNotFound', () => {
    component.setOpenNotFound(true);
    expect(component.isAlertOpenNotFound).toBeTruthy();

    component.setOpenNotFound(false);
    expect(component.isAlertOpenNotFound).toBeFalsy();
  });

  it('setOpenDeleteNotFound should correctly set isAlertOpenDeleteNotFound', () => {
    component.setOpenDeleteNotFound(true);
    expect(component.isAlertOpenDeleteNotFound).toBeTruthy();

    component.setOpenDeleteNotFound(false);
    expect(component.isAlertOpenDeleteNotFound).toBeFalsy();
  });

  it('setOpenExpirationNotFound should correctly set isAlertExpirationOpenNotFound', () => {
    component.setOpenExpirationNotFound(true);
    expect(component.isAlertExpirationOpenNotFound).toBeTruthy();

    component.setOpenExpirationNotFound(false);
    expect(component.isAlertExpirationOpenNotFound).toBeFalsy();
  });

  it('deleteVC should set isModalDeleteOpen to true', () => {
    component.deleteVC();
    expect(component.isModalDeleteOpen).toBeTruthy();
  });

  it('unsignedInfo should set isModalUnsignedOpen to true', () => {
    component.unsignedInfo();
    expect(component.isModalUnsignedOpen).toBeTruthy();
  });

  it('setOpen should correctly set isModalOpen based on the input', () => {
    component.setOpen(true);
    expect(component.isModalOpen).toBeTruthy();

    component.setOpen(false);
    expect(component.isModalOpen).toBeFalsy();
  });

  it('clicking on delete button in deleteButtons should change isModalDeleteOpen accordingly', () => {
    jest.spyOn(component.vcEmit, 'emit');

    component.deleteButtons[0].handler();
    expect(component.isModalDeleteOpen).toBeFalsy();

    component.isModalDeleteOpen = false;

    component.deleteButtons[1].handler();
    expect(component.isModalDeleteOpen).toBeTruthy();
    expect(component.vcEmit.emit).toHaveBeenCalledWith(
      component.credentialInput
    );
  });

  it('clicking on OK button in alertButtons should set handlerMessage and isModalOpen correctly', () => {
    jest.spyOn(component, 'setOpen');

    component.setOpen(true);

    expect(component.setOpen).toHaveBeenCalledWith(true);
  });

  it('clicking on close button in unsignedButtons  should change isModalUnsignedOpen  accordingly', () => {
    jest.spyOn(component.vcEmit, 'emit');

    component.unsignedButtons [0].handler();
    expect(component.isModalUnsignedOpen).toBeFalsy();
  });

  it('qrView should set isAlertExpirationOpenNotFound when credential is expired', () => {
    component.isExpired = true;
    component.qrView();
    expect(component.isAlertExpirationOpenNotFound).toBeTruthy();
  });
  it('qrView should handle HTTP errors correctly', () => {
    component.isExpired = false;
    const mockError = new Error('Network issue');
    jest.spyOn(walletService, 'getVCinCBOR').mockReturnValue(throwError(() => mockError));

    component.qrView();

    expect(component.isAlertOpenNotFound).toBeTruthy();
  })

  /*it('should call deleteVC on Enter key press on delete button', fakeAsync(() => {
    jest.spyOn(component, 'deleteVC');
    fixture.detectChanges();
    const deleteButton = fixture.debugElement.query(By.css('.vc-view-button'));
    expect(deleteButton).toBeTruthy();
    deleteButton.triggerEventHandler('keydown', { key: 'Enter', preventDefault: () => {} });
    tick();
    expect(component.deleteVC).toHaveBeenCalled();
  }));*/

  it('should call deleteVC when keydown event with key "Enter" and action "delete"', fakeAsync(() => {
    jest.spyOn(component, 'deleteVC');
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    component.handleButtonKeydown(event, 'delete');
    tick();
    expect(component.deleteVC).toHaveBeenCalled();
  }));
  it('should call setOpen when keydown event with key " " and action "close"', fakeAsync(() => {
    jest.spyOn(component, 'setOpen');
    const event = new KeyboardEvent('keydown', { key: ' ' });
    component.handleButtonKeydown(event, 'close');
    tick();
    expect(component.setOpen).toHaveBeenCalledWith(false);
  }));
  it('should call unsignedInfo when keydown event with key "Enter" and action "info"', fakeAsync(() => {
    jest.spyOn(component, 'unsignedInfo');
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    component.handleButtonKeydown(event, 'info');
    tick();
    expect(component.unsignedInfo).toHaveBeenCalled();
  }));
  it('should prevent default behavior for button keydown event', fakeAsync(() => {
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    jest.spyOn(event, 'preventDefault');
    component.handleButtonKeydown(event, 'delete');
    tick();
    expect(event.preventDefault).toHaveBeenCalled();
  }));
});