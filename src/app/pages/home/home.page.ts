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
  toggleScan: boolean = false;
  escaneado = '';
  startScan() {
    let selected = this.storageService.get('camara');
    if (selected != '') {
      const device: MediaDeviceInfo | undefined = this.availableDevices.find(
        (x) => x.deviceId === selected
      );
      device != undefined ? (this.currentDevice = device) : this.currentDevice;
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
  @Input() availableDevices: MediaDeviceInfo[] = [];

  currentDevice: MediaDeviceInfo = {
    deviceId: '',
    groupId: '',
    kind: 'audiooutput',
    label: '',
    toJSON() {},
  };

  desactivar: boolean = true;
  constructor(
    private cameraService: CameraService,
    private router: Router,
    private storageService: StorageService,
    private walletService: WalletService
  ) {}
  availableDevicesEmit(devices: MediaDeviceInfo[]) {
    this.availableDevices = devices;
  }
  ngOnInit(): void {
    this.escaneado=''
  }

  qrCodeEmit(qrCode: string) {
this.escaneado= qrCode;
    console.log(qrCode);
    //qrCode="eyJraWQiOiJkaWQ6a2V5OnpEbmFlUms5ZWluQmFKMUJGMUcyZVZ4TkN1b3JaU2FkZ0ZORlVMeWZSdFg1M2dodWMjekRuYWVSazllaW5CYUoxQkYxRzJlVnhOQ3VvclpTYWRnRk5GVUx5ZlJ0WDUzZ2h1YyIsInR5cCI6IkpXVCIsImFsZyI6IkVTMjU2In0.eyJzdWIiOiJkaWQ6a2V5OnpEbmFlWVpiWTg3dk5BZFVjRW9yQ1Rjd3ZKUnRvTmVVZW8zRWpldTZrY0M0VG9UeFoiLCJuYmYiOjE2ODEyMjA0NDcsImlzcyI6ImRpZDprZXk6ekRuYWVSazllaW5CYUoxQkYxRzJlVnhOQ3VvclpTYWRnRk5GVUx5ZlJ0WDUzZ2h1YyIsImlhdCI6MTY4MTIyMDQ0NywidmMiOnsiY3JlZGVudGlhbFNjaGVtYSI6eyJpZCI6Imh0dHBzOi8vZG9tZS5ldS9zY2hlbWFzL0N1c3RvbWVyQ3JlZGVudGlhbC9zY2hlbWEuanNvbiIsInR5cGUiOiJGdWxsSnNvblNjaGVtYVZhbGlkYXRvcjIwMjEifSwiY3JlZGVudGlhbFN1YmplY3QiOnsiZmFtaWx5TmFtZSI6InBlbmciLCJmaXJzdE5hbWUiOiJoYW8iLCJpZCI6ImRpZDprZXk6ekRuYWVZWmJZODd2TkFkVWNFb3JDVGN3dkpSdG9OZVVlbzNFamV1NmtjQzRUb1R4WiJ9LCJpc3N1YW5jZURhdGUiOiJUaHUgTWFyIDMwIDEwOjI3OjQyIFVUQyAyMDIzIiwiaWQiOiJ1cm46dXVpZDpkYTc3ZjZhNy1iOWRhLTQ3MTktYThkOS1jM2QxMTM5ZGI3NzIiLCJ2YWxpZEZyb20iOiIyMDIzLTA0LTExVDEzOjQwOjQ3WiIsImlzc3VlZCI6IjIwMjMtMDQtMTFUMTM6NDA6NDdaIiwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIkN1c3RvbWVyQ3JlZGVudGlhbCJdLCJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJpc3N1ZXIiOiJkaWQ6a2V5OnpEbmFlUms5ZWluQmFKMUJGMUcyZVZ4TkN1b3JaU2FkZ0ZORlVMeWZSdFg1M2dodWMifSwianRpIjoidXJuOnV1aWQ6ZGE3N2Y2YTctYjlkYS00NzE5LWE4ZDktYzNkMTEzOWRiNzcyIn0.jA0ykyPenvIW5LOIMd-uO0edu-NmxlNl0y4IpQfzwZ4GXGnYkm8eQytoHjNbgcSIcppOvQCXomK4G8JFpAwygg"
    this.walletService.executeContent(qrCode).subscribe({
      next: (executionResponse) => {
        console.log('data', executionResponse);
        if (executionResponse==='{}') {
          let TIME_IN_MS = 1500;
          setTimeout(() => {
            this.isAlertOpen = false;
          }, TIME_IN_MS);
          this.isAlertOpen = true;
        } else {
          this.router.navigate(['/vc-selector/'], {
            queryParams: { executionResponse: executionResponse, siop_authentication_request: qrCode },
          });
        }
      },
      error: (err) => {
        console.log(err);
        if (err.status == 422) {
          let TIME_IN_MS = 1500;
          setTimeout(() => {
            this.isAlertOpen = false;
          }, TIME_IN_MS);
          this.isAlertOpen = true;
        } else {
          let TIME_IN_MS = 1500;
          setTimeout(() => {
            this.isAlertOpenFail = false;
          }, TIME_IN_MS);
          this.isAlertOpenFail = true;
        }
      }
  });
  }
  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }
  isAlertOpenFail = false;
  isAlertOpen = false;
}
