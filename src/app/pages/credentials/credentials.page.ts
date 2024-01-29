import {Component, inject, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule, PopoverController} from '@ionic/angular';
import {StorageService} from 'src/app/services/storage.service';
import {BarcodeScannerComponent} from 'src/app/components/barcode-scanner/barcode-scanner.component';
import {QRCodeModule} from 'angular2-qrcode';
import {WalletService} from 'src/app/services/wallet.service';
import {VcViewComponent, VerifiableCredential} from "../../components/vc-view/vc-view.component";
import {TranslateModule} from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import {LogoutPage } from '../logout/logout.page';

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
  private popoverController= inject(PopoverController);

  toggleScan: boolean = false;
  escaneado = '';
  from = '';
  scaned_cred: boolean = false;
  show_qr: boolean = false;

  constructor(
    private route: ActivatedRoute,
    ) {
    this.route.queryParams.subscribe((params) => {
      this.toggleScan = params['toggleScan'];
      this.from = params['from'];
      this.show_qr = params['show_qr'];
    })
  }

  ngOnInit() {
    this.userName = this.authenticationService.getName();
    this.escaneado = '';
    this.scaned_cred = false;
    this.refresh();
  }
  scan(){
    this.toggleScan = true;
    this.show_qr = true;
    console.log("from", this.from);
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

  refresh() {
    this.walletService.getAllVCs().subscribe((credentialListResponse: Array<VerifiableCredential>) => {
      this.credList = credentialListResponse.reverse();
    })
  }

  vcDelete(cred: VerifiableCredential) {
    this.walletService.deleteVC(cred.id).subscribe((response: any) => {
      this.refresh()
    })
  }

  qrCodeEmit(qrCode: string) {
    this.escaneado = qrCode;
    this.toggleScan = false;

    this.walletService.executeContent(qrCode).subscribe({
      next: (executionResponse) => {
        if (qrCode.includes("credential_offer_uri")) {
          this.refresh();
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
        }
      },
      
      error: (err) => {
        this.toggleScan = true;

        if (err.status == 422) {
          setTimeout(() => {
            this.isAlertOpen = false;
          }, ERROR_TIME_IN_MS);
          this.isAlertOpen = true;
          this.escaneado = '';
        } else if (err.status == 404) {
          this.isAlertOpenNotFound = true;
          this.escaneado = '';
        } else {
          setTimeout(() => {
            this.isAlertOpenFail = false;
          }, ERROR_TIME_IN_MS);
          this.isAlertOpenFail = true;
          this.escaneado = '';
        }
      },
    });
  }

  isCredOffer = false;
  untoggleScan(){
    this.toggleScan = false;
  }

  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }

  setOpenNotFound(isOpen: boolean) {
    this.isAlertOpenNotFound = isOpen;
    this.router.navigate(['/home'], {});
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
  isAlertOpenNotFound = false;
  isAlertOpenFail = false;
  isAlertOpen = false;
}