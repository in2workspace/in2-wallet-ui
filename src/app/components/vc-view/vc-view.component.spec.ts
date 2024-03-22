import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { VcViewComponent } from './vc-view.component';
import { WalletService } from 'src/app/services/wallet.service';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

describe('VcViewComponent', () => {
  let component: VcViewComponent;
  let fixture: ComponentFixture<VcViewComponent>;
  let walletService: WalletService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        WalletService
      ],
      declarations: []
    }).compileComponents();

    fixture = TestBed.createComponent(VcViewComponent);
    component = fixture.componentInstance;
    walletService = TestBed.inject(WalletService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call walletService.getVCinCBOR when qrView is called', () => {
    component.isExpired = false;
    spyOn(walletService, 'getVCinCBOR').and.returnValue(of('mockCBOR'));
    component.qrView();
    expect(walletService.getVCinCBOR).toHaveBeenCalledWith(component.credentialInput);
    expect(component.isAlertOpenNotFound).toBeTruthy();
    expect(component.cred_cbor).toEqual('mockCBOR');
  });

  it('should set isExpired to true if expiration date is in the past', () => {
    component.credentialInput.expirationDate = new Date('2022-01-01');
    component.checkExpirationVC();
    expect(component.isExpired).toBeTruthy();
  });

  it('should open the delete modal when deleteView is called', () => {
    component.deleteView();
    expect(component.isModalDeleteOpen).toBeTruthy();
  });

  it('should properly toggle the not found alert state', () => {
    component.setOpenNotFound(true);
    expect(component.isAlertOpenNotFound).toBeTruthy();
    component.setOpenNotFound(false);
    expect(component.isAlertOpenNotFound).toBeFalsy();
  });

  it('should properly toggle the delete not found alert state', () => {
    component.setOpenDeleteNotFound(true);
    expect(component.isAlertOpenDeleteNotFound).toBeTruthy();
    component.setOpenDeleteNotFound(false);
    expect(component.isAlertOpenDeleteNotFound).toBeFalsy();
  });

  it('should properly toggle the expiration not found alert state', () => {
    component.setOpenExpirationNotFound(true);
    expect(component.isAlertExpirationOpenNotFound).toBeTruthy();
    component.setOpenExpirationNotFound(false);
    expect(component.isAlertExpirationOpenNotFound).toBeFalsy();
  });

  it('should correctly change the modal open state with setOpen', () => {
    component.setOpen(true);
    expect(component.isModalOpen).toBeTruthy();
    component.setOpen(false);
    expect(component.isModalOpen).toBeFalsy();
  });

});

