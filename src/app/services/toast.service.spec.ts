import { flush, TestBed } from '@angular/core/testing';
import { ToastServiceHandler } from './toast.service';
import { ToastController } from '@ionic/angular';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateFakeLoader } from '@ngx-translate/core';
import { fakeAsync, tick } from '@angular/core/testing';
const TIME_IN_MS = 3000;

jest.useFakeTimers();

describe('ToastServiceHandler', () => {
  let service: ToastServiceHandler;
  let translateService: {get:jest.Mock};
  let translateSpy: jest.SpyInstance;
  let toastCtrl: {create:jest.Mock};
  let alert: {present:jest.Mock, dismiss:jest.Mock}

  beforeEach(() => {
    translateService = {
      get: jest.fn()
    };

    toastCtrl = {
      create: jest.fn()
    };

    alert = {
      present: jest.fn(),
      dismiss: jest.fn()
    };

    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        }),
      ],
      providers: [
        { provide: TranslateService, use:translateService },
        { provide: ToastController, use: toastCtrl },
        ToastServiceHandler
      ],
    });
    service = TestBed.inject(ToastServiceHandler);
    toastCtrl.create.mockResolvedValue(Promise.resolve({}));
    translateSpy = jest.spyOn(translateService, 'get');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  //TODO 
  // it('should display a toast for an error message 1', fakeAsync(() => {
  //   const errorMessage = "The received QR content cannot be processed";
  //   service.showErrorAlert(errorMessage).subscribe(() => {});
  
  //   tick(TIME_IN_MS);
  
  //   expect(translateSpy).toHaveBeenCalled();
  //   expect(translateSpy).toHaveBeenCalledWith('errors.invalid-qr');
  // }));
  //TODO ALTERNATIVA
  // it('should display a toast for an error message 1', (done) => {
  //   const errorMessage = "The received QR content cannot be processed";
  //   service.showErrorAlert(errorMessage).subscribe(() => {
  //     jest.advanceTimersByTime(TIME_IN_MS);
  //     expect(translateSpy).toHaveBeenCalled();
  //     expect(translateSpy).toHaveBeenCalledWith('errors.invalid-qr');
  //     done();
  //   });
  // }, 10000);
  
  
  

  // it('should display a toast for an error message 2', async () => {
  //   const createSpy = jest.spyOn(toastCtrl, 'create').mockResolvedValue({ present: jest.fn() } as any);

  //   const errorMessage = "Error while fetching credentialOffer from the issuer";
  //   await service.showErrorAlert(errorMessage).toPromise();

  //   jest.advanceTimersByTime(TIME_IN_MS);
  //   expect(createSpy).toHaveBeenCalled();
  // });

  // it('should display a toast for an error message 3', async () => {
  //   const createSpy = jest.spyOn(toastCtrl, 'create').mockResolvedValue({ present: jest.fn() } as any);

  //   const errorMessage = "Error while deserializing CredentialOffer";
  //   await service.showErrorAlert(errorMessage).toPromise();

  //   jest.advanceTimersByTime(TIME_IN_MS);
  //   expect(createSpy).toHaveBeenCalled();
  // });

  // it('should display a toast for an error message 4', async () => {
  //   const createSpy = jest.spyOn(toastCtrl, 'create').mockResolvedValue({ present: jest.fn() } as any);

  //   const errorMessage = "Error while processing Credential Issuer Metadata from the Issuer";
  //   await service.showErrorAlert(errorMessage).toPromise();

  //   jest.advanceTimersByTime(TIME_IN_MS);
  //   expect(createSpy).toHaveBeenCalled();
  // });

  // it('should display a toast for an error message 5', async () => {
  //   const createSpy = jest.spyOn(toastCtrl, 'create').mockResolvedValue({ present: jest.fn() } as any);

  //   const errorMessage = "Error while fetching Credential from Issuer";
  //   await service.showErrorAlert(errorMessage).toPromise();

  //   jest.advanceTimersByTime(TIME_IN_MS);
  //   expect(createSpy).toHaveBeenCalled();
  // });

  // it('should display a toast for an error message 6', async () => {
  //   const createSpy = jest.spyOn(toastCtrl, 'create').mockResolvedValue({ present: jest.fn() } as any);

  //   const errorMessage = "Error processing Verifiable Credential";
  //   await service.showErrorAlert(errorMessage).toPromise();

  //   jest.advanceTimersByTime(TIME_IN_MS);
  //   expect(createSpy).toHaveBeenCalled();
  // });

  // it('should display a toast for an error message Incorrect PIN', async () => {
  //   const createSpy = jest.spyOn(toastCtrl, 'create').mockResolvedValue({ present: jest.fn() } as any);

  //   const errorMessage = "Incorrect PIN";
  //   await service.showErrorAlert(errorMessage).toPromise();

  //   jest.advanceTimersByTime(TIME_IN_MS);
  //   expect(createSpy).toHaveBeenCalled();
  // });

  // it('should display a toast for an error message Unsigned', async () => {
  //   const createSpy = jest.spyOn(toastCtrl, 'create').mockResolvedValue({ present: jest.fn() } as any);

  //   const errorMessage = "Unsigned";
  //   await service.showErrorAlert(errorMessage).toPromise();

  //   jest.advanceTimersByTime(TIME_IN_MS);
  //   expect(createSpy).toHaveBeenCalled();
  // });

  // it('should display a toast for an error message ErrorUnsigned', async () => {
  //   const createSpy = jest.spyOn(toastCtrl, 'create').mockResolvedValue({ present: jest.fn() } as any);

  //   const errorMessage = "ErrorUnsigned";
  //   await service.showErrorAlert(errorMessage).toPromise();

  //   jest.advanceTimersByTime(TIME_IN_MS);
  //   expect(createSpy).toHaveBeenCalled();
  // });
});
