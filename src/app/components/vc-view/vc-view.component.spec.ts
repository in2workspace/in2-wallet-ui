import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VcViewComponent } from './vc-view.component';
import { WalletService } from 'src/app/services/wallet.service';
import { VerifiableCredential } from 'src/app/interfaces/verifiable-credential';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

class WalletServiceMock {
  getVCinCBOR(credential: VerifiableCredential) {
    return of('mock_cbor_string');
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
        VcViewComponent
      ],
      providers: [
        { provide: WalletService, useClass: WalletServiceMock }
      ]
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
            country: ''
          },
          mandatee: {
            id: 'mandateeId',
            first_name: '',
            last_name: '',
            gender: '',
            email: '',
            mobile_phone: ''
          },
          power: [{
            id: '',
            tmf_type: '',
            tmf_domain: [''],
            tmf_function: '',
            tmf_action: ['']
          }],
          life_span: {
            start_date_time: '',
            end_date_time: ''
          }
        }
      }
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
    expect(component.isAlertOpenNotFound).toBeTrue();
  });

  it('checkExpirationVC should set isExpired to true if credential is expired', () => {
    component.credentialInput = { id: 'testId', expirationDate: new Date(Date.now() - 86400000).toISOString() } as VerifiableCredential;

    component.checkExpirationVC();

    expect(component.isExpired).toBeTrue();
  });

  it('checkExpirationVC should set isExpired to false if credential is not expired', () => {
    component.credentialInput = { id: 'testId', expirationDate: new Date(Date.now() + 86400000).toISOString() } as VerifiableCredential;

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

});
