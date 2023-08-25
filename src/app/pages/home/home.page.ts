import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BarcodeScannerComponent } from 'src/app/components/barcode-scanner/barcode-scanner.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { WalletService } from 'src/app/services/wallet.service';
import { CameraService } from 'src/app/services/camera.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
const   TIME_IN_MS = 1500;

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
    ZXingScannerModule,
  ],
})
export class HomePage implements OnInit {
  public alertButtons = ['OK'];
  toggleScan: boolean = false;
  escaneado = '';
  startScan() {
    let selected = this.storageService.get('camara');
    if (selected != '') {
      const device: MediaDeviceInfo | undefined = this.availableDevices.find(
        (x) => x.deviceId === selected
      );
      if(device != undefined)this.currentDevice = device;
    } else {
      this.currentDevice = {
        deviceId: '',
        groupId: '',
        kind: 'audiooutput',
        label: '',
        toJSON() {},
      };
    }
    this.toggleScan = true;
  }
  getCred(){
    this.router.navigate(['/credential-offer/'], {});

  }
  @Input() availableDevices: MediaDeviceInfo[] = [];

  currentDevice: MediaDeviceInfo = {
    deviceId: '',
    groupId: '',
    kind: 'audiooutput',
    label: '',
    toJSON() {},
  };
  userName:string="";
  desactivar: boolean = true;
  constructor(
    private cameraService: CameraService,
    private router: Router,
    private storageService: StorageService,
    private walletService: WalletService,
    private authenticationService:AuthenticationService,
  ) {}
  availableDevicesEmit(devices: MediaDeviceInfo[]) {
    this.availableDevices = devices;
  }
  ngOnInit(): void {
    this.escaneado=''
    this.userName = this.authenticationService.getName();
  }
  isCredOffer=false;
  qrCodeEmit(qrCode: string) {
    this.escaneado= qrCode;
    this.walletService.executeContent(qrCode).subscribe({
      next: (executionResponse) => {
        if (executionResponse==='{}') {
          this.escaneado= '';
          this.isCredOffer=true;
          
        } else {
          this.router.navigate(['/vc-selector/'], {
            queryParams: { executionResponse: executionResponse },
          });
          this.escaneado= '';
        }
      },
      error: (err) => {
        if (err.status == 422) {
          setTimeout(() => {
            this.isAlertOpen = false;
          }, TIME_IN_MS);
          this.isAlertOpen = true;
          this.escaneado= '';
        }
        else if (err.status == 404) {
          this.isAlertOpenNotFound = true;
          this.escaneado= '';
        } 
        else {
          setTimeout(() => {
            this.isAlertOpenFail = false;
          }, TIME_IN_MS);
          this.isAlertOpenFail = true;
          this.escaneado= '';
        }
      }
  });
  }
  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }
  setOpenNotFound(isOpen: boolean) {
    this.isAlertOpenNotFound = isOpen;
    this.router.navigate(['/home'], {});
    }
    isAlertOpenNotFound=false;
  isAlertOpenFail = false;
  isAlertOpen = false;
}
