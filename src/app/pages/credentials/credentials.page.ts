import {ChangeDetectorRef, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AlertController, IonicModule, Platform} from '@ionic/angular';
import {StorageService} from 'src/app/services/storage.service';
import {BarcodeScannerComponent} from 'src/app/components/barcode-scanner/barcode-scanner.component';
import {QRCodeModule} from 'angularx-qrcode';
import {WalletService} from 'src/app/services/wallet.service';
import {VcViewComponent} from '../../components/vc-view/vc-view.component';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {WebsocketService} from 'src/app/services/websocket.service';
import {VerifiableCredential, CredentialStatusType} from 'src/app/interfaces/verifiable-credential';
import {VerifiableCredentialSubjectDataNormalizer} from 'src/app/interfaces/verifiable-credential-subject-data-normalizer';
import {CameraLogsService} from 'src/app/services/camera-logs.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ToastServiceHandler } from 'src/app/services/toast.service';
import { catchError, forkJoin, of } from 'rxjs';

const TIME_IN_MS = 3000;

//TODO don't show creds while scanning, separate scan in another component

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
    BarcodeScannerComponent
  ]
})

// eslint-disable-next-line @angular-eslint/component-class-suffix
export class CredentialsPage implements OnInit {
  public alertButtons = ['OK'];
  public userName = '';
  public credList: Array<VerifiableCredential> = [];
  public size = 300;
  public isAlertOpen = false;
  public toggleScan = false;
  public credOfferEndpoint = '';
  public from = '';
  public scaned_cred = false;
  public show_qr = false;
  public credentialOfferUri = '';


  private readonly alertController = inject(AlertController);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);
  private readonly walletService = inject(WalletService);
  private readonly websocket = inject(WebsocketService);
  private readonly cameraLogsService = inject(CameraLogsService);

  public constructor(private readonly toastServiceHandler: ToastServiceHandler)
    {
    this.credOfferEndpoint = window.location.origin + '/tabs/home';
    this.route.queryParams.subscribe((params) => {
      this.toggleScan = params['toggleScan'];
      this.from = params['from'];
      this.show_qr = params['show_qr'];
      this.credentialOfferUri = params['credentialOfferUri'];
    });

  }

  public ngOnInit(): void {
    this.scaned_cred = false;
    this.refresh();

    // TODO: Find a better way to handle this
    if (this.credentialOfferUri) {
      // SAME-DEVICE CREDENTIAL OFFER FLOW
      this.generateCred();
    }
  }

  ionViewDidEnter(): void {
    this.requestPendingSignatures();
  }

  public requestPendingSignatures(): void {
    if(this.credList.length === 0){
      return;
    }
    console.log('Requesting signatures for pending credentials...');
    const pendingCredentials = this.credList.filter(
      (credential) => credential.lifeCycleStatus === CredentialStatusType.ISSUED
    );
  
    if (pendingCredentials.length === 0) {
      return;
    }
  
    const requests = pendingCredentials.map((credential) =>
      this.walletService.requestSignature(credential.id).pipe(
        catchError((error) => {
          console.error(`Error signing credential ${credential.id}:`, error.message);
          return of({ status: 500 });
        })
      )
    );
  
    forkJoin(requests).subscribe({
      next: (responses: (HttpResponse<string> | { status: number })[]) => {
        const successfulResponses = responses.filter(response => response.status === 204);
    
        if (successfulResponses.length > 0) {
          console.log('Signed credentials:', successfulResponses.length);
          this.forcePageReload();
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Unexpected error in signature requests:', error.message);
        this.toastServiceHandler.showErrorAlert('ErrorUnsigned').subscribe();
      },
    });
  }

  public forcePageReload(): void {
    this.router.navigate(['/tabs/credentials']).then(() => {
      window.location.reload();
    });
  }

  public scan(): void {
    this.toggleScan = true;
    this.show_qr = true;
  }

  public refresh(): void {
    const normalizer = new VerifiableCredentialSubjectDataNormalizer();
    this.walletService.getAllVCs().subscribe({
      next: (credentialListResponse: VerifiableCredential[]) => {
        // Iterate over the list and normalize each credentialSubject
        this.credList = credentialListResponse.slice().reverse().map(cred => {
          if (cred.credentialSubject) {
            cred.credentialSubject = normalizer.normalizeLearCredentialSubject(cred.credentialSubject);
          }
          return cred;
        });
        this.cdr.detectChanges()
      },
      error: (error) => {
        if (error.status === 404) {
          this.credList = [];
          this.cdr.detectChanges();
        } else {
          console.error("Error fetching credentials:", error);
        }
      }
    });
  }

  public vcDelete(cred: VerifiableCredential): void {
    this.walletService.deleteVC(cred.id).subscribe(() => {
      this.refresh();
    });
  }

  public qrCodeEmit(qrCode: string): void {
    this.toggleScan = false;
    this.websocket.connect();

    // TODO: Instead of using a delay, we should wait for the websocket connection to be established
    this.delay(1000).then(() => {
      //todo don't accept qrs that are not to login or get VC
      this.walletService.executeContent(qrCode)
      .pipe(
        takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (executionResponse) => {
            // TODO: Instead of analyzing the qrCode, we should check the response and decide what object we need to show depending on the response
            // CROSS-DEVICE CREDENTIAL OFFER FLOW
            if (qrCode.includes('credential_offer_uri')) {
              this.from = 'credential';
              this.okMessage();
              this.successRefresh();
            } else {
              // login from verifier
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

            const httpErr = httpErrorResponse?.error;
            const message = httpErr?.message || httpErrorResponse?.message || 'No error message';
            const title = httpErr?.title || httpErrorResponse?.title || '(No title)';
            const path = httpErr?.path || httpErrorResponse?.path || '(No path)';

            const error = title + ' . ' + message + ' . ' + path;
            this.cameraLogsService.addCameraLog(new Error(error), 'httpError');

            console.error(httpErrorResponse);
            setTimeout(()=>{
              this.router.navigate(['/tabs/home'])
            }, 1000);

          },
        });
    });
  }

  public generateCred(): void {
    this.websocket.connect();

    // Esperar un segundo antes de continuar
    this.delay(1000).then(() => {
      this.walletService.requestOpenidCredentialOffer(this.credentialOfferUri).subscribe({
        next: () => {
          this.okMessage();
          this.successRefresh();
          this.websocket.closeConnection();
          this.router.navigate(['/tabs/credentials']);
        },
        error: (err) => {
          console.error(err);
          this.websocket.closeConnection();
        },
      });
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
  public async credentialClick(): Promise<void> {
    const alert = await this.alertController.create({
      header: this.translate.instant('credentials.confirmation'),
      message: this.translate.instant('confirmationMessage.confirmation'),
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.info('User canceled');
          },
        },
        {
          text: 'Accept',
          handler: () => {
            console.info('User accepted');
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

  private async okMessage(): Promise<void> {
    const alert = await this.alertController.create({
      message: `
        <div style="display: flex; align-items: center; gap: 50px;">
          <ion-icon name="checkmark-circle-outline" ></ion-icon>
          <span>${this.translate.instant('home.ok-msg')}</span>
        </div>
      `,
      cssClass: 'custom-alert-ok',
    });

    await alert.present();

    setTimeout(async () => {
      await alert.dismiss();
      this.refresh();
    }, 2000);
  }

  private successRefresh(): void {
    setTimeout(() => {
      this.isAlertOpen = false;
      this.scaned_cred = false;
    }, TIME_IN_MS);
    this.refresh();
  }

}