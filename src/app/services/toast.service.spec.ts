import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ToastServiceHandler } from './toast.service';
import { ToastController } from '@ionic/angular';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';
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

  it('should display a toast for an error message', fakeAsync(() => {

    spyOn(toastCtrl, 'create').and.callThrough();

    const errorMessage = "Error processing Verifiable Credential";
    service.showErrorAlert(errorMessage).subscribe();


    tick(TIME_IN_MS);

    expect(toastCtrl.create).toHaveBeenCalled();
  }));
});
