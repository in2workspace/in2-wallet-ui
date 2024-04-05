import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { mergeMap, map, Observable } from 'rxjs';
const TIME_IN_MS = 3000;

@Injectable({
  providedIn: 'root'
})
export class ToastServiceHandler {

  constructor(private toastController: ToastController,
    private translate: TranslateService
  ) { }


  showErrorAlert(message: string): Observable<any> {
    let messageBody = "home.unsuccess"
    if (message.startsWith("The received QR content cannot be processed")) {
      messageBody = "errors.invalid-qr"
    }
    else if (message.startsWith("Error while fetching credentialOffer from the issuer")) {
      messageBody = "errors.expired-credentialOffer"
    }
    else if (message.startsWith("Error while deserializing CredentialOffer")) {
      messageBody = "errors.invalid-credentialOffer"
    }
    else if (message.startsWith("Error while processing Credential Issuer Metadata from the Issuer")) {
      messageBody = "errors.invalid-issuerMetadata"
    }
    else if (message.startsWith("Error while fetching  Credential from Issuer")) {
      messageBody = "errors.cannot-get-VC"
    }
    else if (message.startsWith("Error processing Verifiable Credential")) {
      messageBody = "errors.cannot-save-VC"
    }
    return this.translate.get(messageBody).pipe(
      mergeMap(translatedHeader => this.translate.get(messageBody).pipe(
        map(async translatedMessage => {

          const alert = await this.toastController.create({
            header: translatedHeader,
            [message]: translatedMessage,
            cssClass: 'toast-custom',

            buttons: ['OK']
          });

          await alert.present();

          setTimeout(() => {
            alert.dismiss();
          }, TIME_IN_MS);
        })
      )));


  }

}
