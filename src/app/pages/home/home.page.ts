import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BarcodeScannerComponent } from 'src/app/components/barcode-scanner/barcode-scanner.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { WalletService } from 'src/app/services/wallet.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { TranslateModule } from '@ngx-translate/core';
import { DataService } from 'src/app/services/data.service';

const TIME_IN_MS = 1500;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    BarcodeScannerComponent,
    TranslateModule,
    RouterModule
  ],
})
export class HomePage implements OnInit {

  public alertButtons = ['OK'];
  public did: string = '';
  public ebsiFlag: boolean = true;
  toggleScan: boolean = false;
  escaneado = '';

  async startScan() {
    this.toggleScan = true;
    this.ebsiFlag = false;
  }


  @Input() availableDevices: MediaDeviceInfo[] = [];

  userName: string = '';
  desactivar: boolean = true;

  constructor(
    private router: Router,
    private walletService: WalletService,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private dataService: DataService

  ) {
  }

  ngOnInit() {
    this.escaneado = '';
    this.userName = this.authenticationService.getName();
    this.ebsiFlag = false;
    this.dataService.listenDid().subscribe((data) => {
      this.ebsiFlag = true;
      this.did = data;
    })
  }

  isCredOffer = false;
  untoggleScan() {
    this.toggleScan = false;

  }
  qrCodeEmit(qrCode: string) {
    this.escaneado = qrCode;
    this.walletService.executeContent(qrCode).subscribe({
      next: (executionResponse) => {
        if (qrCode.includes("credential_offer_uri")) {
          this.escaneado = '';
          setTimeout(() => {
            this.router.navigate(['/tabs/credentials/'])

          }, TIME_IN_MS);
        } else {
          // fixme: Sonar Lint: Need .then()
          this.router.navigate(['/tabs/vc-selector/'], {
            queryParams: { executionResponse: executionResponse },
          });
          this.escaneado = '';
        }
      },
      error: (err) => {
       
      },
    });
  }


  copyToClipboard(textToCopy: string) {
    let texto = '';

    if (textToCopy === 'did-text') {
      texto = document.getElementById('did-text')!.innerText;
      const prefix = 'DID: ';
      if (texto.startsWith(prefix)) {
        texto = texto.substring(prefix.length);
      }
    } else if (textToCopy === 'endpoint-text') {
      texto = 'test-openid-credential-offer://';
    }

    const textarea = document.createElement('textarea');
    textarea.value = texto;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }


}
