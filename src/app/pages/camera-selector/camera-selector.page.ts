import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { BarcodeFormat } from '@zxing/library';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { StorageService } from 'src/app/services/storage.service';
import { WalletService } from 'src/app/services/wallet.service';
import { BarcodeScannerComponent } from '../../components/barcode-scanner/barcode-scanner.component';
import { CameraService } from 'src/app/services/camera.service';
@Component({
  selector: 'app-camera-selector',
  templateUrl: './camera-selector.page.html',
  styleUrls: ['./camera-selector.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ZXingScannerModule,
    BarcodeScannerComponent,
  ],
})
export class CameraSelectorPage implements OnInit {
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
    private router: Router,
    private storageService: StorageService,
    private walletService: WalletService,
    private cameraService: CameraService
  ) {}
  ngOnInit(): void {}
  availableDevicesEmit(devices: MediaDeviceInfo[]) {
    this.availableDevices = devices;
  }

  IonViewDidLeave() {
    this.desactivar = false;
  }
  onDeviceSelectChange(selected: string) {
    if (selected != '') {
      const device:MediaDeviceInfo|undefined = this.availableDevices.find((x) => x.deviceId === selected);
      this.cameraService.camara=device;
      device != undefined ? (this.currentDevice = device) : false;
      this.desactivar = true;
    } else {
      this.currentDevice = {
        deviceId: '',
        groupId: '',
        kind: 'audiooutput',
        label: '',
        toJSON() {},
      };
      this.desactivar = false;
    }
  }
}
