import { flush, TestBed } from '@angular/core/testing';
import { ToastServiceHandler } from './toast.service';
import { ToastController } from '@ionic/angular';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateFakeLoader } from '@ngx-translate/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
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
      get: jest.fn().mockImplementation((str:string)=>of(str))
    };

    alert = {
      present: jest.fn().mockResolvedValue({val:''}),
      dismiss: jest.fn().mockResolvedValue({})
    };

    toastCtrl = {
      create: jest.fn().mockReturnValue(alert),
    };

    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        }),
      ],
      providers: [
        { provide: TranslateService, useValue:translateService },
        { provide: ToastController, useValue: toastCtrl },
        ToastServiceHandler
      ],
    });
    service = TestBed.inject(ToastServiceHandler);
    translateSpy = jest.spyOn(translateService, 'get');
  });

//TODO need to check that alert.present and alert.dismiss are called. The problem is that
//TODO the method is called but toHaveBeenCalled returns erro, either because the reference
//TODO is lost or due to asynchronic


  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should format message correctly and translate it', fakeAsync(() => {
    service.showErrorAlert('Any undefined test message');
    tick();
    expect(translateSpy).toHaveBeenCalledWith('errors.default');

    service.showErrorAlert("The received QR content cannot be processed");
    tick();
    expect(translateSpy).toHaveBeenCalledWith('errors.invalid-qr');

    service.showErrorAlert("Error while fetching credentialOffer from the issuer");
    tick();
    expect(translateSpy).toHaveBeenCalledWith("errors.expired-credentialOffer");
    
    service.showErrorAlert("Error while deserializing CredentialOffer");
    tick();
    expect(translateSpy).toHaveBeenCalledWith("errors.invalid-credentialOffer");
    
    service.showErrorAlert("Error while processing Credential Issuer Metadata from the Issuer");
    tick();
    expect(translateSpy).toHaveBeenCalledWith("errors.invalid-issuerMetadata");
    
    service.showErrorAlert("Error while fetching  Credential from Issuer");
    tick();
    expect(translateSpy).toHaveBeenCalledWith("errors.cannot-get-VC");

    service.showErrorAlert("Error processing Verifiable Credential");
    tick();
    expect(translateSpy).toHaveBeenCalledWith("errors.cannot-save-VC");

    service.showErrorAlert("Incorrect PIN");
    tick();
    expect(translateSpy).toHaveBeenCalledWith("errors.incorrect-pin");

    service.showErrorAlert("Unsigned");
    tick();
    expect(translateSpy).toHaveBeenCalledWith("errors.unsigned");
    
    service.showErrorAlert("ErrorUnsigned");
    tick();
    expect(translateSpy).toHaveBeenCalledWith("errors.Errunsigned");
  }));

  //TODO 
 
  it('should create alert for an error message 1', fakeAsync(() => {
    const errorMessage = "The received QR content cannot be processed";
    service.showErrorAlert(errorMessage).subscribe(()=>{});
  
    tick();
  
    expect(translateSpy).toHaveBeenCalledWith('errors.invalid-qr');
    expect(toastCtrl.create).toHaveBeenCalled();
    expect(toastCtrl.create).toHaveBeenCalledWith(expect.objectContaining(
      {
        [errorMessage]:'errors.invalid-qr'
      }
    ));
    // expect(alert.present).toHaveBeenCalled();
  }));
 
  it('should create alert for an error message 2', fakeAsync(() => {
    const errorMessage = "Error while fetching credentialOffer from the issuer";
    service.showErrorAlert(errorMessage).subscribe(()=>{});
  
    tick();
  
    expect(translateSpy).toHaveBeenCalledWith('errors.expired-credentialOffer');
    expect(toastCtrl.create).toHaveBeenCalled();
    expect(toastCtrl.create).toHaveBeenCalledWith(expect.objectContaining(
      {
        [errorMessage]:"errors.expired-credentialOffer"
      }
    ));
    // expect(alert.present).toHaveBeenCalled();
  }));

  it('should create alert for an error message 3', fakeAsync(() => {
    const errorMessage = "Error while deserializing CredentialOffer";
    service.showErrorAlert(errorMessage).subscribe(()=>{});
  
    tick();
  
    expect(translateSpy).toHaveBeenCalledWith('errors.invalid-credentialOffer');
    expect(toastCtrl.create).toHaveBeenCalled();
    expect(toastCtrl.create).toHaveBeenCalledWith(expect.objectContaining(
      {
        [errorMessage]:"errors.invalid-credentialOffer"
      }
    ));
    // expect(alert.present).toHaveBeenCalled();
  }));

  it('should create alert for an error message 4', fakeAsync(() => {
    const errorMessage = "Error while processing Credential Issuer Metadata from the Issuer";
    service.showErrorAlert(errorMessage).subscribe(()=>{});
    
    tick();
    
    expect(translateSpy).toHaveBeenCalledWith('errors.invalid-issuerMetadata');
    expect(toastCtrl.create).toHaveBeenCalled();
    expect(toastCtrl.create).toHaveBeenCalledWith(expect.objectContaining(
      {
        [errorMessage]: "errors.invalid-issuerMetadata"
      }
    ));
    // expect(alert.present).toHaveBeenCalled();
  }));
  
  it('should create alert for an error message 5', fakeAsync(() => {
    const errorMessage = "Error while fetching  Credential from Issuer";
    service.showErrorAlert(errorMessage).subscribe(()=>{});
    
    tick();
    
    expect(translateSpy).toHaveBeenCalledWith('errors.cannot-get-VC');
    expect(toastCtrl.create).toHaveBeenCalled();
    expect(toastCtrl.create).toHaveBeenCalledWith(expect.objectContaining(
      {
        [errorMessage]: "errors.cannot-get-VC"
      }
    ));
    // expect(alert.present).toHaveBeenCalled();
  }));
  
  it('should create alert for an error message 6', fakeAsync(() => {
    const errorMessage = "Error processing Verifiable Credential";
    service.showErrorAlert(errorMessage).subscribe(()=>{});
    
    tick();
    
    expect(translateSpy).toHaveBeenCalledWith('errors.cannot-save-VC');
    expect(toastCtrl.create).toHaveBeenCalled();
    expect(toastCtrl.create).toHaveBeenCalledWith(expect.objectContaining(
      {
        [errorMessage]: "errors.cannot-save-VC"
      }
    ));
    // expect(alert.present).toHaveBeenCalled();
  }));
  
  it('should create alert for an error message 7', fakeAsync(() => {
    const errorMessage = "Incorrect PIN";
    service.showErrorAlert(errorMessage).subscribe(()=>{});
    
    tick();
    
    expect(translateSpy).toHaveBeenCalledWith('errors.incorrect-pin');
    expect(toastCtrl.create).toHaveBeenCalled();
    expect(toastCtrl.create).toHaveBeenCalledWith(expect.objectContaining(
      {
        [errorMessage]: "errors.incorrect-pin"
      }
    ));
    // expect(alert.present).toHaveBeenCalled();
  }));
  
  it('should create alert for an error message 8', fakeAsync(() => {
    const errorMessage = "Unsigned";
    service.showErrorAlert(errorMessage).subscribe(()=>{});
    
    tick();
    
    expect(translateSpy).toHaveBeenCalledWith('errors.unsigned');
    expect(toastCtrl.create).toHaveBeenCalled();
    expect(toastCtrl.create).toHaveBeenCalledWith(expect.objectContaining(
      {
        [errorMessage]: "errors.unsigned"
      }
    ));
    // expect(alert.present).toHaveBeenCalled();
  }));
  
  it('should create alert for an error message 9', fakeAsync(() => {
    const errorMessage = "ErrorUnsigned";
    service.showErrorAlert(errorMessage).subscribe(()=>{});
    
    tick();
    
    expect(translateSpy).toHaveBeenCalledWith('errors.Errunsigned');
    expect(toastCtrl.create).toHaveBeenCalled();
    expect(toastCtrl.create).toHaveBeenCalledWith(expect.objectContaining(
      {
        [errorMessage]: "errors.Errunsigned"
      }
    ));
    // expect(alert.present).toHaveBeenCalled();
  }));
  
  
  
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
