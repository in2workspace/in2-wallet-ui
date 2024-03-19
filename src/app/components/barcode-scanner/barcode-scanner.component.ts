import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { BarcodeFormat } from '@zxing/library';
import { ZXingScannerModule,ZXingScannerComponent } from '@zxing/ngx-scanner';
import { BehaviorSubject, Observable, distinctUntilChanged, map, scan, shareReplay, startWith } from 'rxjs';
import { CameraService } from 'src/app/services/camera.service';

@Component({
  selector: 'app-barcode-scanner',
  templateUrl: './barcode-scanner.component.html',
  standalone: true,
  imports: [CommonModule, ZXingScannerModule],
})
export class BarcodeScannerComponent implements OnInit{

  @Output() availableDevices: EventEmitter<MediaDeviceInfo[]> =
    new EventEmitter();
  @Output() qrCode: EventEmitter<string> = new EventEmitter();
  constructor(private cameraService:CameraService) {
  }
  ngOnInit(): void {
    setTimeout(()=>{
      this.cameraService.updateCamera();
    },2000)

  }

  onCodeResult(resultString: string) {
    this.qrCode.emit(resultString);
  }

  async onCamerasFound(devices:any): Promise<void> {
    this.availableDevices.emit(devices);
  }


  @ViewChild('scanner') scanner!: ZXingScannerComponent;

  allowedFormats = [BarcodeFormat.QR_CODE];

  devices$ = new BehaviorSubject<MediaDeviceInfo[]>([]);

  toggleCamera$ = new BehaviorSubject<boolean>(false);
  enable$ = this.toggleCamera$.pipe(
    map((value) => {
      return value;
    }),
    distinctUntilChanged(),
    shareReplay(1)
  );
  selectedDevice$: Observable<MediaDeviceInfo> = this.cameraService.navCamera$.pipe(
    map((device) => {
    this.toggleCamera$.next(device.deviceId!='')
    return device;
  }
  ),
    distinctUntilChanged(),
    shareReplay(1)
  );




  scanSuccess$ = new BehaviorSubject<string>('');

  scanError(error: Error) {
    console.error(error);
  }
}




/*







  @ViewChild('scanner')
  scanner: ZXingScannerComponent = new ZXingScannerComponent;

  
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
    this.scanner.restart();
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
*/