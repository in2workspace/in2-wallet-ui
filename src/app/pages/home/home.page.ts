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
  toggleScan: boolean = false;
  escaneado = '';
  from = '';
  scaned_cred: boolean = false;
  show_qr: boolean = false;
  isScaned: boolean = false;
  isReady: boolean = true;

  async startScan() {
    this.toggleScan = true;
    this.show_qr = true;
  }


  @Input() availableDevices: MediaDeviceInfo[] = [];

  userName: string = '';
  desactivar: boolean = true;

  constructor(
    private router: Router,
    private walletService: WalletService,
    private authenticationService: AuthenticationService,
    private popoverController: PopoverController,
    private route: ActivatedRoute,
    ) {
      this.route.queryParams.subscribe((params) => {
        this.toggleScan = params['toggleScan'];
        this.from = params['from'];
        this.show_qr = params['show_qr'];
      })
  }

  ngOnInit() {
    this.escaneado = '';
    this.userName = this.authenticationService.getName();
    this.scaned_cred = false;
    this.isScaned = false;
    this.isReady = true;
  }

  ionViewWillLeave() {
    this.scaned_cred = false;
  }

  isCredOffer = false;
  untoggleScan(){
    this.toggleScan = false;
  }

  logout(){
    this.authenticationService.logout().subscribe(()=>{
      this.router.navigate(['/login'], {})

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

  qrCodeEmit(qrCode: string) {
    this.escaneado = qrCode;
    console.log(this.isScaned, this.isReady);
    if (!this.isScaned && this.isReady) {
      this.isReady = false;
    this.walletService.executeContent(qrCode).subscribe({
      next: (executionResponse) => {
        if (qrCode.includes("credential_offer_uri")) {
          this.escaneado = '';
          this.from = 'credential';
          this.scaned_cred = true;
        } else {
          this.show_qr = false;
          this.from = '';
          this.router.navigate(['/tabs/vc-selector/'], {
            queryParams: {executionResponse: executionResponse},
          });
          this.escaneado = '';
          this.isScaned = true;
        }
      },
      
      error: (err) => {
        if (err.status == 422) {
          setTimeout(() => {
            this.isAlertOpen = false;
          }, TIME_IN_MS);
          this.isAlertOpen = true;
          this.escaneado = '';
        } else if (err.status == 404) {
          this.isAlertOpenNotFound = true;
          this.escaneado = '';
        } else {
          setTimeout(() => {
            this.isAlertOpenFail = false;
            this.isReady = false;
          }, TIME_IN_MS);
          this.isAlertOpenFail = true;
          this.scaned_cred = false;
          this.escaneado = '';
        }
        this.toggleScan = false;
      },
    });
    }
    console.log(this.isScaned);
  }

  credentialClick() {
    setTimeout(() => {
      this.isAlertOpen = false;
      this.router.navigate(['/tabs/credentials/'])
    }, TIME_IN_MS);
    this.show_qr = true;
    this.scaned_cred = false;
    this.from = '';
  }

  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
    this.isReady = true;
  }

  setOpenNotFound(isOpen: boolean) {
    this.isAlertOpenNotFound = isOpen;
    this.router.navigate(['/home'], {});
  }

  isAlertOpenNotFound = false;
  isAlertOpenFail = false;
  isAlertOpen = false;

}
