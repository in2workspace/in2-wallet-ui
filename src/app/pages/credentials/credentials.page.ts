import { ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { BarcodeScannerComponent } from 'src/app/components/barcode-scanner/barcode-scanner.component';
import { QRCodeModule } from 'angularx-qrcode';
import { WalletService } from 'src/app/services/wallet.service';
import { VcViewComponent } from '../../components/vc-view/vc-view.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { WebsocketService } from 'src/app/services/websocket.service';
import { DataService } from 'src/app/services/data.service';
import { VerifiableCredential } from 'src/app/interfaces/verifiable-credential';
import { CameraLogsService } from 'src/app/services/camera-logs.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

const TIME_IN_MS = 3000;
//TODO unsubscribe

@Component({
  selector: 'app-credentials',
  templateUrl: './credentials.page.html',
  styleUrls: ['./credentials.page.scss'],
  standalone: true,
  providers: [StorageService],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    QRCodeModule,
    VcViewComponent,
    TranslateModule,
    BarcodeScannerComponent,
  ],
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class CredentialsPage implements OnInit {
  @Input() public availableDevices: MediaDeviceInfo[] = [];
  public alertButtons = ['OK'];
  public userName = '';
  public credList: Array<VerifiableCredential> = [];
  public size = 300;
  public credDataList: unknown[] = [];
  public currentDevice: unknown;
  public isAlertOpen = false;
  public toggleScan = false;
  public credOfferEndpoint = '';
  public from = '';
  public scaned_cred = false;
  public show_qr = false; //remove, it doesn't have any effect by now (overshadowed by untoggleScan)
  public credentialOfferUri = '';
  public ebsiFlag = false;
  public did = '';
  public isCredOffer = false;

  private walletService = inject(WalletService);
  private router = inject(Router);
  private websocket = inject(WebsocketService);
  private dataService = inject(DataService);
  private route = inject(ActivatedRoute);

  public constructor(
    private alertController: AlertController,
    public translate: TranslateService,
    private cameraLogsService: CameraLogsService,
    private cdr: ChangeDetectorRef)
    {
    this.credOfferEndpoint = window.location.origin + '/tabs/credentials';
    this.route.queryParams.subscribe((params) => {
      this.toggleScan = params['toggleScan'];
      this.from = params['from'];
      this.show_qr = params['show_qr'];
      this.credentialOfferUri = params['credentialOfferUri'];
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.dataService.listenDid().subscribe((data: any) => {
      if (data != '') {
        this.ebsiFlag = true;
        this.did = data;
      }
    });

    this.router.events
    .pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntilDestroyed()
    )
    .subscribe((event: NavigationEnd) => {
      if (this.route.snapshot.routeConfig?.path==='credentials' && !event.urlAfterRedirects.startsWith('/tabs/credentials')) {
        //when leaving page, untoggle scan to deactivate camera
        this.untoggleScan();
        this.cdr.detectChanges();
      }else if(
        //when navigating to current page, untoggle scan (show list)
        this.route.snapshot.routeConfig?.path==='credentials' &&
        event.urlAfterRedirects.startsWith('/tabs/credentials') && this.toggleScan){
        this.untoggleScan();
      }
    });

  }

  public ngOnInit() {
    console.log('CREDENTIALS ON INIT')
    this.scaned_cred = false;
    this.fetchCredentials();
    // TODO: Find a better way to handle this
    if (this.credentialOfferUri !== undefined) {
      this.generateCred();
    }
  }

  ionViewWillEnter(){
    this.untoggleScan();
    console.log('ionViewWillEnter ');
  }

  public scan() {
    this.toggleScan = true;
    this.show_qr = true;
    this.ebsiFlag = false;
  }

  // ? Reconsider. Maybe rename
  public untoggleScan() {
    this.toggleScan = false;
  }

  // TODO: This should be moved to the settings page because this is something recreated to ebsi and this option is enabled in the settings page
  public async copyToClipboard(textToCopy: string) {
    let text = '';

    if (textToCopy === 'did-text') {
      const didTextElement = document.getElementById('did-text');

      if (didTextElement) {
        text = didTextElement.innerText.trim();
        const prefix = 'DID: ';
        if (text.startsWith(prefix)) {
          text = text.substring(prefix.length);
        }
      } else {
        console.error('Element with id "did-text" not found.');
        return;
      }
    } else if (textToCopy === 'endpoint-text') {
      text = this.credOfferEndpoint || '';
    } else {
      console.error('Invalid text to copy:', textToCopy);
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error('Error when trying to copy the text to clipboard:', error);
    }
  }

  //todo better naming
  public fetchCredentials() {
    this.walletService
      .getAllVCs()
      .subscribe((credentialListResponse: VerifiableCredential[]) => {
        this.credList = credentialListResponse.slice().reverse();
      });
  }

  //todo don't show last VC after delete
  //todo is it really necessary to re-fetch VCs?
  public vcDelete(cred: VerifiableCredential) {
    this.walletService.deleteVC(cred.id).subscribe(() => {
      this.fetchCredentials();
    });
  }

  public qrCodeEmit(qrCode: string) {
    console.log('qr code emit')
    this.toggleScan = false;
    this.websocket.connect();

    // TODO: Instead of using a delay, we should wait for the websocket connection to be established
    this.delay(1000).then(() => {
      this.walletService.executeContent(qrCode)
        .subscribe({
          next: (executionResponse) => {
            // TODO: Instead of analyzing the qrCode, we should check the response and decide what object we need to show depending on the response
            if (qrCode.includes('credential_offer_uri')) {
              this.from = 'credential';
              this.isAlertOpen = true;
              this.scaned_cred = true;
              setTimeout(() => {
                this.isAlertOpen = false;
                this.scaned_cred = false;
              }, TIME_IN_MS);
              this.fetchCredentials();

            } else { //login verifier
              this.show_qr = false;
              this.from = '';
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
            this.toggleScan = true;
            const httpErr = httpErrorResponse.error;
            const error = httpErr.title + ' . ' + httpErr.message + ' . ' + httpErr.path;
            this.cameraLogsService.addCameraLog(new Error(error), 'httpError');
            console.error(httpErrorResponse);
          },
        });
    });
  }

  public generateCred() {
    this.websocket.connect();

    // Esperar un segundo antes de continuar
    this.delay(1000).then(() => {
      this.walletService.requestCredential(this.credentialOfferUri).subscribe({
        next: () => {
          //todo is it really necessary to re-fetch VCs?
          this.fetchCredentials();
          this.websocket.closeConnection();
          //todo feedback for success?
        },
        error: (err) => {
          console.error(err);
          this.websocket.closeConnection();
        },
      });
      //todo add some logic to reset from, credentialOfferUri
    });
  }


  public handleButtonKeydown(event: KeyboardEvent, action: string): void {
    if (event.key === 'Enter' || event.key === ' ') {
      if (action === 'scan') {
        this.scan();
      } else if (action === 'getCredential') {
        this.credentialClick();
      }
      event.preventDefault();
    }
  }

  //TODO consider removing: after scanning cred, a success popup is already shown + there is not a translation for this at i18n files
  public async credentialClick() {
    const alert = await this.alertController.create({
      header: this.translate.instant('credentials.confirmation'),
      message: this.translate.instant('confirmationMessage.confirmation'),
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            // ? is this handler necessary?
            console.log('User canceled');
          },
        },
        {
          text: 'Accept',
          handler: () => {
            console.log('User accepted');
            setTimeout(() => {
              this.isAlertOpen = false;
              this.toggleScan = false;
              this.router.navigate(['/tabs/credentials/']);
            }, TIME_IN_MS);
            this.isAlertOpen = true;
            this.show_qr = true;
            this.scaned_cred = false;
            this.from = '';
          },
        },
      ],
    });

    await alert.present();

  }
  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}
