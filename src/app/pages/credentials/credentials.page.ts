import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { BarcodeScannerComponent } from 'src/app/components/barcode-scanner/barcode-scanner.component';
import { QRCodeModule } from 'angularx-qrcode';
import { WalletService } from 'src/app/services/wallet.service';
import { VcViewComponent } from "../../components/vc-view/vc-view.component";
import { TranslateModule } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WebsocketService } from 'src/app/services/websocket.service';
import { DataService } from 'src/app/services/data.service';
import { VerifiableCredential } from 'src/app/interfaces/verifiable-credential';

const TIME_IN_MS = 10000;


@Component({
  selector: 'app-credentials',
  templateUrl: './credentials.page.html',
  styleUrls: ['./credentials.page.scss'],
  standalone: true,
  providers: [StorageService],
  imports: [IonicModule, CommonModule, FormsModule, QRCodeModule, VcViewComponent, TranslateModule, BarcodeScannerComponent,]
})
export class CredentialsPage implements OnInit {
  testi:VerifiableCredential={
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://www.evidenceledger.eu/2022/credentials/employee/v1"
    ],
    "id": "1f33e8dc-bd3b-4395-8061-ebc6be7d06dd",
    "type": [
      "VerifiableCredential",
      "LEARCredentialEmployee"
    ],
    "issuer": {
      "id": "did:web:provider.dome.fiware.dev"
    },
    "issuanceDate": "2024-04-02 09:23:22.637345122 +0000 UTC",
    "validFrom": "2024-04-02 09:23:22.637345122 +0000 UTC",
    "expirationDate": "2025-04-02 09:23:22.637345122 +0000 UTC",
    "credentialSubject": {
      "mandate": {
        "id": "4e3c02b8-5c57-4679-8aa5-502d62484af5",
        "mandator": {
          "organizationIdentifier": "VATES-B60645900",
          "commonName": "IN2",
          "emailAddress": "rrhh@in2.es",
          "serialNumber": "B60645900",
          "organization": "IN2, Ingeniería de la Información, S.L.",
          "country": "ES"
        },
        "mandatee": {
          "id": "did:key:...",
          "first_name": "Oriol",
          "last_name": "Canadés",
          "gender": "M",
          "email": "oriol.canades@in2.es",
          "mobile_phone": "+34666336699"
        },
        "power": [
          {
            "id": "6b8f3137-a57a-46a5-97e7-1117a20142fb",
            "tmf_type": "Domain",
            "tmf_domain": [
              "DOME"
            ],
            "tmf_function": "Onboarding",
            "tmf_action": [
              "Execute"
            ]
          },
          {
            "id": "ad9b1509-60ea-47d4-9878-18b581d8e19b",
            "tmf_type": "Domain",
            "tmf_domain": [
              "DOME"
            ],
            "tmf_function": "ProductOffering",
            "tmf_action": [
              "Create",
              "Update"
            ]
          }
        ],
        "life_span": {
          "start_date_time": "2024-04-02 09:23:22.637345122 +0000 UTC",
          "end_date_time": "2025-04-02 09:23:22.637345122 +0000 UTC"
        }
      }
    }
  }
  private walletService = inject(WalletService);
  private router = inject(Router);
  private websocket = inject(WebsocketService);
  private dataService = inject(DataService);
  private route = inject(ActivatedRoute)

  public alertButtons = ['OK'];
  userName: string = '';

  credList: Array<VerifiableCredential> = [];
  size: number = 300;
  credDataList: any[] = [];
  @Input() availableDevices: MediaDeviceInfo[] = [];
  currentDevice: any;

  toggleScan: boolean = false;
  credOfferEndpoint = "";
  from = '';
  scaned_cred: boolean = false;
  show_qr: boolean = false;
  credentialOfferUri = '';
  public ebsiFlag: boolean = false;
  public did: string = '';

  constructor(private alertController: AlertController) {
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
    } catch (error) {
      console.error('Error al copiar texto al portapapeles:', error);
    }
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
          this.from = 'credential';
          this.isAlertOpen=true
          this.scaned_cred = true;
          setTimeout(() => {
            this.isAlertOpen = false;
            this.scaned_cred = false;
          }, TIME_IN_MS);
          this.refresh();
        } else {
          this.show_qr = false;
          this.from = '';
          this.router.navigate(['/tabs/vc-selector/'], {
            queryParams: { executionResponse: JSON.stringify(executionResponse) },
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

  async credentialClick() {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Quieres escoger esta credencial?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Usuario canceló');
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            console.log('Usuario aceptó');
            setTimeout(() => {
              this.isAlertOpen = false;
              this.toggleScan = false;
              this.router.navigate(['/tabs/credentials/']);
            }, TIME_IN_MS);
            this.isAlertOpen = true;
            this.show_qr = true;
            this.scaned_cred = false;
            this.from = '';
          }
        }
      ]
    });

    await alert.present();
  }

  isAlertOpen = false;
}
