import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {BarcodeScannerComponent} from 'src/app/components/barcode-scanner/barcode-scanner.component';
import {ActivatedRoute, Router,RouterModule} from '@angular/router';
import {WalletService} from 'src/app/services/wallet.service';
import {AuthenticationService} from 'src/app/services/authentication.service';
import {TranslateModule} from '@ngx-translate/core';

const TIME_IN_MS = 1500;

@Component({
    selector: 'app-scan-cred',
    templateUrl: './scan-cred.page.html',
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
  export class ScanCredPage implements OnInit {

    public alertButtons = ['OK'];
    toggleScan: boolean = false;
    escaneado = '';
    error : boolean = false;
    showBut : boolean = false;

    @Input() availableDevices: MediaDeviceInfo[] = [];

    userName: string = '';

    constructor(
        private router: Router,
        private walletService: WalletService,
        private authenticationService: AuthenticationService,
        private route: ActivatedRoute,
    
      ) {
      }

    ngOnInit() {
        this.escaneado = '';
        this.userName = this.authenticationService.getName();
        this.error = false;
        this.showBut = false;
      }
    
    addCred() {
        this.router.navigate(['/tabs/credentials/']);
    }

    qrCodeEmit(qrCode: string) {
        this.escaneado = qrCode;
        this.walletService.executeContent(qrCode).subscribe({
          next: (executionResponse) => {
            if (qrCode.includes("credential_offer_uri")) {
              this.escaneado = '';
              setTimeout(() => {
                this.isAlertOpen = false;
                this.showBut = true;
                //this.router.navigate(['/tabs/credentials/'])
    
              }, TIME_IN_MS);
              this.isAlertOpen = true;
            } else {
              // fixme: Sonar Lint: Need .then()
              this.error = true;
              this.escaneado = '';
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
              }, TIME_IN_MS);
              this.isAlertOpenFail = true;
              this.escaneado = '';
            }
          },
        });
    }

    setOpen(isOpen: boolean) {
        this.isAlertOpen = isOpen;
      }
    
      setOpenNotFound(isOpen: boolean) {
        this.isAlertOpenNotFound = isOpen;
        // fixme: Sonar Lint: Need .then()
        this.router.navigate(['/home'], {});
      }
    


    isAlertOpenNotFound = false;
    isAlertOpenFail = false;
    isAlertOpen = false;

  }