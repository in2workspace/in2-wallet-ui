// error-handler.service.ts

import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ToastServiceHandler {

  constructor(private toastController: ToastController,
    private translate: TranslateService
    ) {}

  async showErrorAlert(headerMessage:string ,message: string): Promise<void> {
    const translatedHeader = await this.translate.get(headerMessage).toPromise();
    const translatedMessage = await this.translate.get(message).toPromise();

    const alert = await this.toastController.create({
      header: translatedHeader,
      [message]: translatedMessage,
      buttons: ['OK']
    });

    await alert.present();
  }
}
