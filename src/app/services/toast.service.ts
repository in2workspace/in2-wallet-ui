import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { mergeMap, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastServiceHandler {

  constructor(private toastController: ToastController,
    private translate: TranslateService
  ) { }

  showErrorAlert(headerMessage: string, message: string): Observable<any> {
    return this.translate.get(headerMessage).pipe(
      mergeMap(translatedHeader => this.translate.get(headerMessage).pipe(
        map(async translatedMessage => {

          const alert = await this.toastController.create({
            header: translatedHeader,
            [message]: translatedMessage,
            buttons: ['OK']
          });

          await alert.present();
        })
      )));


  }
}
