
import { DataService } from 'src/app/services/data.service';
import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule, PopoverController} from '@ionic/angular';
import {BarcodeScannerComponent} from 'src/app/components/barcode-scanner/barcode-scanner.component';
import {ActivatedRoute, Router, RouterModule } from '@angular/router';
import {WalletService} from 'src/app/services/wallet.service';
import {AuthenticationService} from 'src/app/services/authentication.service';
import {TranslateModule} from '@ngx-translate/core';
import {LogoutPage } from '../logout/logout.page';

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
    this.show_qr = true;
    this.router.navigate(['/tabs/credentials/'], {
      queryParams: { toggleScan: true, from: 'home', show_qr: true },
    });
  }
  from = '';
  scaned_cred: boolean = false;
  show_qr: boolean = false;
  isScaned: boolean = false;
  isReady: boolean = true;



  @Input() availableDevices: MediaDeviceInfo[] = [];

  userName: string = '';
  desactivar: boolean = true;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private dataService: DataService,
    private popoverController: PopoverController,
    private walletService: WalletService,
    ) {
      this.route.queryParams.subscribe((params) => {
        this.toggleScan = params['toggleScan'];
        this.from = params['from'];
        this.show_qr = params['show_qr'];
      })
  }

  credentialClick(){}
  ionViewWillLeave() {
    this.scaned_cred = false;
  }

  isCredOffer = false;




  async openPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: LogoutPage, 
      event: ev,
      translucent: true,
      cssClass: 'custom-popover'
    });
  
    await popover.present();
  }

  ngOnInit() {
    this.escaneado = '';
    this.userName = this.authenticationService.getName();
    this.scaned_cred = false;
    this.isScaned = false;
    this.isReady = true;
    this.userName = this.authenticationService.getName();
    this.ebsiFlag = false;
    this.dataService.listenDid().subscribe((data) => {
      this.ebsiFlag = true;
      this.did = data;
    })
  }

  untoggleScan() {
    this.toggleScan = false;

  }
  qrCodeEmit(qrCode: string) {
    this.escaneado = qrCode;
    if (!this.isScaned && this.isReady) {
      this.isReady = false;
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
          this.isScaned = true;
        }
      },
      error: (err) => {
       
          this.scaned_cred = false;
          this.escaneado = '';
        
        this.toggleScan = false;
      },
    });
    }
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



  logout(){
    this.authenticationService.logout().subscribe(()=>{
      this.router.navigate(['/login'], {})

    });
  }

}
