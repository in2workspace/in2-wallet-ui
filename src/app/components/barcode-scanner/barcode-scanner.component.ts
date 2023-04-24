import { CommonModule } from '@angular/common';
import {
  Component,
  ViewChild,
  AfterViewInit,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { BarcodeFormat } from '@zxing/library';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

@Component({
  selector: 'app-barcode-scanner',
  templateUrl: './barcode-scanner.component.html',
  styleUrls: ['./barcode-scanner.component.scss'],
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

  constructor() {}
  ngOnInit(): void {}

  clearResult(): void {
    this.qrResultString = '';
  }

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices.emit(devices);
    this.hasDevices = Boolean(devices && devices.length);
  }

  onCodeResult(resultString: string) {
    this.qrCode.emit(resultString);

  }

}
