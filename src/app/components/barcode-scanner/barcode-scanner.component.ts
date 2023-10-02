import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { BarcodeFormat } from '@zxing/library';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { Observable, map } from 'rxjs';
import { CameraService } from 'src/app/services/camera.service';
import { StorageService } from 'src/app/services/storage.service';

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
  cameraEnabled:boolean = false;
  hasDevices: boolean = false;
  formatsEnabled: BarcodeFormat[] = [BarcodeFormat.QR_CODE];
  constructor(private cameraService:CameraService) {
  }
  ngOnInit(): void {
    this.cameraService.navEnabled$
    .subscribe(preferedDevice => {
      this.cameraEnabled=preferedDevice}
      )
    this.cameraService.navCamera$
    .subscribe(preferedDevice => {
      this.currentDevice = preferedDevice}
      )
    setTimeout(()=>{
      this.cameraService.updateCamera();
    },1000)
  }


  async onCamerasFound(devices: MediaDeviceInfo[]): Promise<void> {
    this.availableDevices.emit(devices);

  }

  onCodeResult(resultString: string) {
    this.qrCode.emit(resultString);
  }
}
