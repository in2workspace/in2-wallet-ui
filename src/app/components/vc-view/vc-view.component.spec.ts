import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { VcViewComponent } from './vc-view.component';
import { WalletService } from 'src/app/services/wallet.service';
import { CredentialStatus, VerifiableCredential } from 'src/app/interfaces/verifiable-credential';
import { Observable, of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { HttpResponse } from '@angular/common/http';
import { By } from '@angular/platform-browser';

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
        HttpClientTestingModule,
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
      issuanceDate: '',
      validFrom: '',
      expirationDate: new Date(Date.now() + 86400000).toISOString(),
      credentialSubject: {
        mandate: {
          id: 'mandateId',
          mandator: {
            organizationIdentifier: '',
            commonName: '',
            emailAddress: '',
            serialNumber: '',
            organization: '',
            country: '',
          },
          mandatee: {
            id: 'mandateeId',
            first_name: '',
            last_name: '',
            gender: '',
            email: '',
            mobile_phone: '',
          },
          power: [
            {
              id: '',
              tmf_type: '',
              tmf_domain: [''],
              tmf_function: '',
              tmf_action: [''],
            },
          ],
          life_span: {
            start_date_time: '',
            end_date_time: '',
          },
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
    spyOn(walletService, 'getVCinCBOR').and.returnValue(of(mockCBOR));

    component.qrView();

    expect(walletService.getVCinCBOR).toHaveBeenCalledWith(component.credentialInput);
    expect(component.cred_cbor).toEqual(mockCBOR);
    expect(component.isAlertOpenNotFound).toBeFalse();
  });


  it('checkExpirationVC should set isExpired to true if credential is expired', () => {
    component.credentialInput = {
      id: 'testId',
      expirationDate: new Date(Date.now() - 86400000).toISOString(),
    } as VerifiableCredential;

    component.checkExpirationVC();

    expect(component.isExpired).toBeTrue();
  });

  it('checkExpirationVC should set isExpired to false if credential is not expired', () => {
    component.credentialInput = {
      id: 'testId',
      expirationDate: new Date(Date.now() + 86400000).toISOString(),
    } as VerifiableCredential;

    component.checkExpirationVC();

    expect(component.isExpired).toBeFalse();
  });

  it('setOpen should correctly set isModalOpen', () => {
    component.setOpen(true);
    expect(component.isModalOpen).toBeTrue();

    component.setOpen(false);
    expect(component.isModalOpen).toBeFalse();
  });

  it('setOpenNotFound should correctly set isAlertOpenNotFound', () => {
    component.setOpenNotFound(true);
    expect(component.isAlertOpenNotFound).toBeTrue();

    component.setOpenNotFound(false);
    expect(component.isAlertOpenNotFound).toBeFalse();
  });

  it('setOpenDeleteNotFound should correctly set isAlertOpenDeleteNotFound', () => {
    component.setOpenDeleteNotFound(true);
    expect(component.isAlertOpenDeleteNotFound).toBeTrue();

    component.setOpenDeleteNotFound(false);
    expect(component.isAlertOpenDeleteNotFound).toBeFalse();
  });

  it('setOpenExpirationNotFound should correctly set isAlertExpirationOpenNotFound', () => {
    component.setOpenExpirationNotFound(true);
    expect(component.isAlertExpirationOpenNotFound).toBeTrue();

    component.setOpenExpirationNotFound(false);
    expect(component.isAlertExpirationOpenNotFound).toBeFalse();
  });

  it('deleteVC should set isModalDeleteOpen to true', () => {
    component.deleteVC();
    expect(component.isModalDeleteOpen).toBeTrue();
  });

  it('setOpen should correctly set isModalOpen based on the input', () => {
    component.setOpen(true);
    expect(component.isModalOpen).toBeTrue();

    component.setOpen(false);
    expect(component.isModalOpen).toBeFalse();
  });

  it('clicking on delete button in deleteButtons should change isModalDeleteOpen accordingly', () => {
    spyOn(component.vcEmit, 'emit');

    component.deleteButtons[0].handler();
    expect(component.isModalDeleteOpen).toBeFalse();

    component.isModalDeleteOpen = false;

    component.deleteButtons[1].handler();
    expect(component.isModalDeleteOpen).toBeTrue();
    expect(component.vcEmit.emit).toHaveBeenCalledWith(
      component.credentialInput
    );
  });

  it('clicking on OK button in alertButtons should set handlerMessage and isModalOpen correctly', () => {
    spyOn(component, 'setOpen');

    component.setOpen(true);

    expect(component.setOpen).toHaveBeenCalledWith(true);
  });

  it('should set showChip to true if "cwt_vc" is in available_formats', () => {
    component.credentialInput.available_formats = ['cwt_vc'];
    component.checkAvailableFormats();
    expect(component.showChip).toBeTrue();
  });

  it('should set showChip to false if "cwt_vc" is not in available_formats', () => {
    component.credentialInput.available_formats = ['other_format'];
    component.checkAvailableFormats();
    expect(component.showChip).toBeFalse();
  });

  it('should not set showChip if available_formats is undefined', () => {
    component.credentialInput.available_formats = undefined;
    const initialShowChip = component.showChip;
    component.checkAvailableFormats();
    expect(component.showChip).toBe(initialShowChip);
  });

  it('qrView should set isAlertExpirationOpenNotFound when credential is expired', () => {
    component.isExpired = true;
    component.qrView();
    expect(component.isAlertExpirationOpenNotFound).toBeTrue();
  });
  it('qrView should handle HTTP errors correctly', () => {
    component.isExpired = false;
    const mockError = new Error('Network issue');
    spyOn(walletService, 'getVCinCBOR').and.returnValue(throwError(() => mockError));

    component.qrView();

    expect(component.isAlertOpenNotFound).toBeTrue();
  })

  it('requestSignature should force page reload on successful response with non-204 status', () => {
    spyOn((component as any).walletService, 'requestSignature').and.returnValue(of(new HttpResponse({ status: 200 })));
    spyOn(component, 'forcePageReload');

    component.requestSignature();

    expect(component.forcePageReload).toHaveBeenCalled();
  });
  it('should call requestSignature on Enter key', fakeAsync(() => {
    spyOn(component, 'requestSignature');

    const button = fixture.debugElement.query(By.css('.request-signature-button'));
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    button.nativeElement.dispatchEvent(event);
    tick();

    expect(component.requestSignature).toHaveBeenCalled();
  }));

  it('should call requestSignature on Space key', fakeAsync(() => {
    spyOn(component, 'requestSignature');

    const button = fixture.debugElement.query(By.css('.request-signature-button'));
    const event = new KeyboardEvent('keydown', { key: ' ' });
    button.nativeElement.dispatchEvent(event);
    tick();

    expect(component.requestSignature).toHaveBeenCalled();
  }));
});
