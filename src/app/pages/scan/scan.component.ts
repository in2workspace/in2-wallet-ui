import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { QRCodeModule } from 'angularx-qrcode';
import { BarcodeScannerComponent } from 'src/app/components/barcode-scanner/barcode-scanner.component';
import { VcViewComponent } from 'src/app/components/vc-view/vc-view.component';
import { CameraLogsService } from 'src/app/services/camera-logs.service';
import { WalletService } from 'src/app/services/wallet.service';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.scss'],
  standalone: true,
  imports:[    
    IonicModule,
    CommonModule,
    FormsModule,
    QRCodeModule,
    TranslateModule,
    BarcodeScannerComponent,
    VcViewComponent
  ]
})
export class ScanComponent  implements OnInit {
  private cameraLogsService = inject(CameraLogsService);
  private router = inject(Router);
  private walletService = inject(WalletService);
  private websocket = inject(WebsocketService);
  
  public from: undefined|string = undefined;
  public isAlertOpen = false;
  public scaned_cred = false;
  constructor() { 

  }
  
  ngOnInit() {}

  public qrCodeEmit(qrCode: string) {
    console.log('qr code emit')
    this.websocket.connect();

    // TODO: Instead of using a delay, we should wait for the websocket connection to be established
    this.delay(1000).then(() => {
      this.walletService.executeContent(qrCode)
        .subscribe({
          next: (executionResponse) => {
            // TODO: Instead of analyzing the qrCode, we should check the response and decide what object we need to show depending on the response
            if (qrCode.includes('credential_offer_uri')) {
              //! així es farà refetch? és a dir es reinicia comp credentials?
              this.router.navigate(['tabs/credentials'], 
                {queryParams:{scaned_cred:'true'}}
                // todo {queryParamsHandling: 'preserve'}?
              );

            } else { //login verifier
              this.router.navigate(['/tabs/vc-selector/'], {
                queryParams: {
                  executionResponse: JSON.stringify(executionResponse),
                },
              });
            }
            this.websocket.closeConnection();
          },
          error: (httpErrorResponse) => {
            this.websocket.closeConnection();
            const httpErr = httpErrorResponse.error;
            const error = httpErr.title + ' . ' + httpErr.message + ' . ' + httpErr.path;
            this.cameraLogsService.addCameraLog(new Error(error), 'httpError');
            console.error(httpErrorResponse);
          },
        });
    });
  }

//todo refactor
  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}
