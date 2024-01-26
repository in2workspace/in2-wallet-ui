import {CommonModule} from '@angular/common';
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BarcodeFormat} from '@zxing/library';
import {ZXingScannerModule} from '@zxing/ngx-scanner';
import {CameraService} from 'src/app/services/camera.service';

@Component({
  selector: 'app-barcode-scanner',
  templateUrl: './barcode-scanner.component.html',
  standalone: true,
  imports: [CommonModule, ZXingScannerModule],
})
export class BarcodeScannerComponent implements OnInit {
  @Output() availableDevices: EventEmitter<MediaDeviceInfo[]> =
    new EventEmitter();
  @Output() qrCode: EventEmitter<string> = new EventEmitter();
  currentDevice: MediaDeviceInfo = this.cameraService.mediaDeviceInfoNull
  cameraEnabled: boolean = false;
  hasDevices: boolean = false;
  formatsEnabled: BarcodeFormat[] = [BarcodeFormat.QR_CODE];

  constructor(private cameraService: CameraService) {
    console.log("constructor");
  }

  ngOnInit(): void {
    this.cameraService.navEnabled$
      .subscribe(preferedDevice => {
          this.cameraEnabled = preferedDevice
        }
      )
    this.cameraService.navCamera$
      .subscribe(preferedDevice => {
          this.currentDevice = preferedDevice
        }
      )
    setTimeout(() => {
      this.cameraService.updateCamera();
    }, 1000)
  }

  async onCamerasFound(devices: MediaDeviceInfo[]): Promise<void> {
    this.availableDevices.emit(devices);

  }

  onCodeResult(resultString: string) {
      const variable = this.qrCode.emit(resultString);
      console.log(variable);
  }
}
