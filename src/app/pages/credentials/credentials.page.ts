import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, PopoverController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { BarcodeScannerComponent } from 'src/app/components/barcode-scanner/barcode-scanner.component';
import { QRCodeModule } from 'angular2-qrcode';
import { WalletService } from 'src/app/services/wallet.service';
import { VcViewComponent } from "../../components/vc-view/vc-view.component";
import { TranslateModule } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { LogoutPage } from '../logout/logout.page';
import { WebsocketService } from 'src/app/services/websocket.service';
import { DataService } from 'src/app/services/data.service';
import { VerifiableCredential } from 'src/app/interfaces/verifiable-credential';

const TIME_IN_MS = 10000;

const ERROR_TIME_IN_MS = 1500;

@Component({
  selector: 'app-credentials',
  templateUrl: './credentials.page.html',
  styleUrls: ['./credentials.page.scss'],
  standalone: true,
  providers: [StorageService],
  imports: [IonicModule, CommonModule, FormsModule, QRCodeModule, VcViewComponent, TranslateModule, BarcodeScannerComponent,]
})
export class CredentialsPage implements OnInit {
  public alertButtons = ['OK'];
  userName: string = '';

  credList: Array<VerifiableCredential> = [];
  size: number = 300;
  credDataList: any[] = [];
  @Input() availableDevices: MediaDeviceInfo[] = [];
  currentDevice: any;
  private walletService = inject(WalletService);
  private router = inject(Router);
  private authenticationService = inject(AuthenticationService);
  private popoverController = inject(PopoverController);
  private websocket = inject(WebsocketService);
  toggleScan: boolean = false;
  credOfferEndpoint = "";
  from = '';
  scaned_cred: boolean = false;
  show_qr: boolean = false;
  credentialOfferUri = '';
  public ebsiFlag: boolean = false;
  public did: string = '';

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
  ) {
    this.credOfferEndpoint = window.location.origin + "/tabs/home";
    this.route.queryParams.subscribe((params) => {
      this.toggleScan = params['toggleScan'];
      this.from = params['from'];
      this.show_qr = params['show_qr'];
      this.credentialOfferUri = params['credentialOfferUri'];
    })
    this.dataService.listenDid().subscribe((data: any) => {
      if (data != "") {
        this.ebsiFlag = true;
        this.did = data;
      }
    })
  }

  ngOnInit() {
    this.userName = this.authenticationService.getName();
    this.scaned_cred = false;
    this.refresh();
    if (this.credentialOfferUri !== '') {
      this.generateCred();
    }
  }
  scan() {
    this.toggleScan = true;
    this.show_qr = true;
    this.ebsiFlag = false;
  }

  async copyToClipboard(textToCopy: string) {
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
      console.log('Texto copiado al portapapeles:', text);
    } catch (error) {
      console.error('Error al copiar texto al portapapeles:', error);
    }
  }

  logout() {
    this.authenticationService.logout().subscribe(() => {
      this.router.navigate(['/home'], {})
    });
  }

  async openPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: LogoutPage,
      event: ev,
      translucent: true,
      cssClass: 'custom-popover'
    });

    await popover.present();
  }

  refresh() {
    this.walletService.getAllVCs().subscribe((credentialListResponse: VerifiableCredential[]) => {
      this.credList = credentialListResponse.slice().reverse(); // Copiar el array y luego invertirlo
    })
  }

  vcDelete(cred: VerifiableCredential) {
    this.walletService.deleteVC(cred.id).subscribe(() => {
      this.refresh()
    })
  }

  qrCodeEmit(qrCode: string) {
    this.toggleScan = false;
    this.websocket.connect()
    this.walletService.executeContent(qrCode).subscribe({
      next: (executionResponse) => {
        if (qrCode.includes("credential_offer_uri")) {
          this.refresh();
          this.from = 'credential';
          this.scaned_cred = true;
        } else {
          this.show_qr = false;
          this.from = '';
          this.router.navigate(['/tabs/vc-selector/'], {
            queryParams: { executionResponse: executionResponse },
          });
        }
      },

      error: (err) => {
        this.toggleScan = true;
        console.error(err)
      },
    });
  }

  generateCred() {
    this.websocket.connect();
    this.walletService.requestCredential(this.credentialOfferUri).subscribe({
      next: () => {
        this.refresh();
      },
      error: (err) => {
        console.error(err)
      },
    })
  }

  isCredOffer = false;
  untoggleScan() {
    this.toggleScan = false;
  }

  credentialClick() {
    setTimeout(() => {
      this.isAlertOpen = false;
      this.toggleScan = false;
      this.router.navigate(['/tabs/credentials/'])
    }, TIME_IN_MS);
    this.isAlertOpen = true;
    this.show_qr = true;
    this.scaned_cred = false;
    this.from = '';
  }
  isAlertOpen = false;
}
