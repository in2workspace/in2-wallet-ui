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

});
