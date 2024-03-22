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
    spyOn(translateService, 'get').and.callFake((key) => {
      switch (key) {
        case 'HEADER_KEY':
          return of('HEADER_KEY_translated');
        case 'MESSAGE_KEY':
          return of('MESSAGE_KEY_translated');
        default:
          return of('');
      }
    });
    const toastSpy = spyOn(toastCtrl, 'create').and.returnValue(Promise.resolve({
      present: () => Promise.resolve()
    }) as any);

    service.showErrorAlert('HEADER_KEY', 'MESSAGE_KEY').subscribe();

    tick();

    expect(translateService.get).toHaveBeenCalledWith('HEADER_KEY');
    expect(translateService.get).toHaveBeenCalledTimes(2);

    expect(toastSpy).toHaveBeenCalledWith(jasmine.objectContaining({
      header: 'HEADER_KEY_translated',
      message: jasmine.any(String),
      buttons: ['OK']
    }));
  }));
});
