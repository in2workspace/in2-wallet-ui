import { CommonModule } from '@angular/common';
import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  ViewChild,
} from '@angular/core';
import { BarcodeFormat } from '@zxing/library';
import { ZXingScannerModule, ZXingScannerComponent } from '@zxing/ngx-scanner';
import {
  BehaviorSubject,
  Observable,
  distinctUntilChanged,
  map,
  shareReplay,
} from 'rxjs';
import { CameraService } from 'src/app/services/camera.service';

@Component({
  selector: 'app-barcode-scanner',
  templateUrl: './barcode-scanner.component.html',
  standalone: true,
  imports: [CommonModule, ZXingScannerModule],
})
export class BarcodeScannerComponent implements OnInit {
  @Output() public availableDevices: EventEmitter<MediaDeviceInfo[]> =
    new EventEmitter();
  @Output() public qrCode: EventEmitter<string> = new EventEmitter();
  @ViewChild('scanner') public scanner!: ZXingScannerComponent;

  public allowedFormats = [BarcodeFormat.QR_CODE];

  public devices$ = new BehaviorSubject<MediaDeviceInfo[]>([]);

  public toggleCamera$ = new BehaviorSubject<boolean>(false);
  public enable$ = this.toggleCamera$.pipe(
    map((value) => {
      return value;
    }),
    distinctUntilChanged(),
    shareReplay(1)
  );
  public selectedDevice$: Observable<MediaDeviceInfo> =
    this.cameraService.navCamera$.pipe(
      map((device) => {
        this.toggleCamera$.next(device.deviceId != '');
        return device;
      }),
      distinctUntilChanged(),
      shareReplay(1)
    );

  public scanSuccess$ = new BehaviorSubject<string>('');
  public constructor(private cameraService: CameraService) {}
  public ngOnInit(): void {
    setTimeout(() => {
      this.cameraService.updateCamera();
    }, 2000);
  }

  public onCodeResult(resultString: string) {
    this.qrCode.emit(resultString);
  }

  public async onCamerasFound(devices: MediaDeviceInfo[]): Promise<void> {
    this.availableDevices.emit(devices);
  }

  public scanError(error: Error) {
    console.error(error);
  }
}
