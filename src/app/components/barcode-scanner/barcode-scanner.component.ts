import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { BarcodeFormat } from '@zxing/library';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
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
  @Output() qrCode: EventEmitter<string> =
  new EventEmitter();
  @Input() currentDevice: MediaDeviceInfo = {
    deviceId: '',
    groupId: '',
    kind: 'audiooutput',
    label: '',
    toJSON() {},
  };
  hasDevices: boolean = false;
  formatsEnabled: BarcodeFormat[] = [BarcodeFormat.QR_CODE];
  qrResultString: string = '';

  constructor(
    private storageService: StorageService
  ) {}
  ngOnInit(): void {
  }


  clearResult(): void {
    this.qrResultString = '';
  }

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices.emit(devices);
    this.hasDevices = Boolean(devices && devices.length);
    let cam= this.storageService.get("camara");
    if(cam!=undefined && cam != "undefined"){
      console.log(cam)
      const device:MediaDeviceInfo|undefined = devices.find((x) => x.deviceId === cam);
      device!=undefined?this.currentDevice=device:this.currentDevice
    }
    else{
      this.currentDevice={
        deviceId: '',
        groupId: '',
        kind: 'audiooutput',
        label: '',
        toJSON() {},
      }}  }

  onCodeResult(resultString: string) {
    this.qrCode.emit(resultString);
  }

}
