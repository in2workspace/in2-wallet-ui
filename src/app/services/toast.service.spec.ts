import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ToastServiceHandler } from './toast.service';
import { ToastController } from '@ionic/angular';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateFakeLoader } from '@ngx-translate/core';
const TIME_IN_MS = 3000;
describe('ToastServiceHandler', () => {
  let service: ToastServiceHandler;
  let translateService: TranslateService;
  let toastCtrl: ToastController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        }),
      ],
      providers: [
        TranslateService,
        ToastController,
        ToastServiceHandler
      ],
    });
    service = TestBed.inject(ToastServiceHandler);
    translateService = TestBed.inject(TranslateService);
    toastCtrl = TestBed.inject(ToastController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should display a toast for an error message 6', fakeAsync(() => {

    spyOn(toastCtrl, 'create').and.callThrough();

    const errorMessage = "Error processing Verifiable Credential";
    service.showErrorAlert(errorMessage).subscribe();


    tick(TIME_IN_MS);

    expect(toastCtrl.create).toHaveBeenCalled();
  }));
  it('should display a toast for an error message 1', fakeAsync(() => {

    spyOn(toastCtrl, 'create').and.callThrough();

    const errorMessage = "The received QR content cannot be processed";
    service.showErrorAlert(errorMessage).subscribe();


    tick(TIME_IN_MS);

    expect(toastCtrl.create).toHaveBeenCalled();
  }));
  it('should display a toast for an error message 2', fakeAsync(() => {

    spyOn(toastCtrl, 'create').and.callThrough();

    const errorMessage = "Error while fetching credentialOffer from the issuer";
    service.showErrorAlert(errorMessage).subscribe();


    tick(TIME_IN_MS);

    expect(toastCtrl.create).toHaveBeenCalled();
  }));
    it('should display a toast for an error message 3', fakeAsync(() => {

    spyOn(toastCtrl, 'create').and.callThrough();

    const errorMessage = "Error while deserializing CredentialOffer";
    service.showErrorAlert(errorMessage).subscribe();


    tick(TIME_IN_MS);

    expect(toastCtrl.create).toHaveBeenCalled();
  }));
  it('should display a toast for an error message 4', fakeAsync(() => {

    spyOn(toastCtrl, 'create').and.callThrough();

    const errorMessage = "Error while processing Credential Issuer Metadata from the Issuer";
    service.showErrorAlert(errorMessage).subscribe();


    tick(TIME_IN_MS);

    expect(toastCtrl.create).toHaveBeenCalled();
  }));
  it('should display a toast for an error message 5', fakeAsync(() => {

    spyOn(toastCtrl, 'create').and.callThrough();

    const errorMessage = "Error while fetching  Credential from Issuer";
    service.showErrorAlert(errorMessage).subscribe();


    tick(TIME_IN_MS);

    expect(toastCtrl.create).toHaveBeenCalled();
  }));
  it('should display a toast for an error message 5', fakeAsync(() => {

    spyOn(toastCtrl, 'create').and.callThrough();

    const errorMessage = "Incorrect PIN";
    service.showErrorAlert(errorMessage).subscribe();


    tick(TIME_IN_MS);

    expect(toastCtrl.create).toHaveBeenCalled();
  }));
  it('should display a toast for an error message 6', fakeAsync(() => {

    spyOn(toastCtrl, 'create').and.callThrough();

    const errorMessage = "Unsigned";
    service.showErrorAlert(errorMessage).subscribe();


    tick(TIME_IN_MS);

    expect(toastCtrl.create).toHaveBeenCalled();
  }));
  it('should display a toast for an error message 7', fakeAsync(() => {

    spyOn(toastCtrl, 'create').and.callThrough();

    const errorMessage = "ErrorUnsigned";
    service.showErrorAlert(errorMessage).subscribe();


    tick(TIME_IN_MS);

    expect(toastCtrl.create).toHaveBeenCalled();
  }));
});
