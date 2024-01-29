// alert.service.ts
import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private alertController: AlertController) {}

  async showPinInputAlert(): Promise<string> {
    const alert = await this.alertController.create({
      header: 'Introducir PIN',
      inputs: [
        {
          name: 'pin',
          type: 'number',
          placeholder: 'PIN',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Enviar',
          handler: (data) => {
            return data.pin;
          },
        },
      ],
    });

    await alert.present();
    const result = await alert.onDidDismiss();
    return result.data?.values.pin || '';
  }
}
