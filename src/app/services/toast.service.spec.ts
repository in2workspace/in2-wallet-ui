import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ToastServiceHandler } from './toast.service';
import { ToastController } from '@ionic/angular';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';
import { TranslateFakeLoader } from '@ngx-translate/core';

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

  it('showErrorAlert should display translated message in a toast', fakeAsync(() => {
    const errorMessage = "The received QR content cannot be processed";
    spyOn(translateService, 'get').and.returnValue(of('Invalid QR Code'));
    const toastSpy = spyOn(toastCtrl, 'create').and.returnValue(Promise.resolve({
      present: () => Promise.resolve(),
      dismiss: () => Promise.resolve()
    }) as any);

    service.showErrorAlert(errorMessage).subscribe();

    tick();

    expect(translateService.get).toHaveBeenCalledWith('errors.invalid-qr');
    expect(toastSpy).toHaveBeenCalledWith(jasmine.objectContaining({
      message: 'Invalid QR Code',
      buttons: ['OK']
    }));
  }));

});
