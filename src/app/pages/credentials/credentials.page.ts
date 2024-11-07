import { ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { QRCodeModule } from 'angularx-qrcode';
import { WalletService } from 'src/app/services/wallet.service';
import { VcViewComponent } from '../../components/vc-view/vc-view.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { WebsocketService } from 'src/app/services/websocket.service';
import { DataService } from 'src/app/services/data.service';
import { VerifiableCredential } from 'src/app/interfaces/verifiable-credential';

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
    RouterLink
  ],
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class CredentialsPage implements OnInit {
  // public alertButtons = ['OK'];
  public credList: Array<VerifiableCredential> = [];


  private TIME_IN_MS = 3000;
  public toggleScan = false;
  public scaned_cred = false;

  public credOfferEndpoint = '';
  public from = '';
  public credentialOfferUri = '';

  public ebsiFlag = false;
  public did = '';

  private walletService = inject(WalletService);
  private router = inject(Router);
  private websocket = inject(WebsocketService);
  private dataService = inject(DataService);
  private route = inject(ActivatedRoute);

  public constructor(){
    // ? add "/list"?
    this.credOfferEndpoint = window.location.origin + '/tabs/credentials';
    this.route.queryParams.subscribe((params) => {
      this.from = params['from'];
      this.credentialOfferUri = params['credentialOfferUri'];
    });

    this.dataService.listenDid().subscribe((data: any) => {
      if (data != '') {
        this.ebsiFlag = true;
        this.did = data;
      }
    });

  }

  public ngOnInit() {
    this.fetchCredentials();
    // TODO: Find a better way to handle this
    if (this.credentialOfferUri !== undefined) {
      this.generateCred();
    }
  }

  public fetchCredentials() {
    this.walletService
      .getAllVCs()
      .subscribe((credentialListResponse: VerifiableCredential[]) => {
        this.credList = credentialListResponse.slice().reverse();

        const scaned_cred_param = this.route.snapshot.params['scaned_cred'];
        if(scaned_cred_param){
              this.scaned_cred = true;
              setTimeout(() => {
                this.scaned_cred = false;
              }, this.TIME_IN_MS);
        }
      });
  }

  //todo don't show last VC after delete
  //todo is it really necessary to re-fetch VCs?
  public vcDelete(cred: VerifiableCredential) {
    this.walletService.deleteVC(cred.id).subscribe(() => {
      this.fetchCredentials();
    });
  }

  public generateCred() {
    this.websocket.connect();

    // todo remove delay, continue when websocket connection is stable
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
      //todo add some logic to reset from and credentialOfferUri
    });
  }

  public handleButtonKeydown(event: KeyboardEvent, action: string): void {
    if (event.key === 'Enter' || event.key === ' ') {
      if (action === 'scan') {
        this.router.navigate(['/tabs/settings'], {queryParamsHandling: 'preserve'});
      }
      event.preventDefault();
    }
  }

  //todo avoid or, at least, refactor
  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
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

}
