import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CameraLogsService } from './../../services/camera-logs.service';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
  filter,
  map,
  shareReplay,
} from 'rxjs';
import { CameraLogType } from 'src/app/interfaces/camera-log';
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
  public newSelectedCamera!: MediaDeviceInfo;
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
  public constructor(
    private cameraService: CameraService,
    private cameraLogsService: CameraLogsService,
    private route: ActivatedRoute,
    private router: Router) {
      //en canviar de ruta es desactiva càmera
      this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe((event: NavigationEnd) => {
        console.log("scanner resets after code result");
        this.scanner.reset();
      });
    }
  public ngOnInit(): void {
    setTimeout(() => {
      this.cameraService.updateCamera();
    }, 2000);
    console.log("barcode-scanner component init");
  }

  public onCodeResult(resultString: string) {
    this.qrCode.emit(resultString);
    console.log("qrCode updated: " + resultString);
  }

  public async onCamerasFound(devices: MediaDeviceInfo[]): Promise<void> {
    const selectedDevices: MediaDeviceInfo[] = [];
    for (const device of devices) {
      if (/back|rear|environment/gi.test(device.label)) {
        selectedDevices.push(device);
        break;
      }
    }
    if (selectedDevices.length === 0) {
      this.newSelectedCamera = devices[1] || devices[0];
    } else {
      this.newSelectedCamera = selectedDevices[0];
    }

    this.availableDevices.emit(devices);
  }

  public scanError(error: Error|undefined, exceptionType: CameraLogType) {
    console.error("Error when scanning from barcode-scanner: " + error );
    console.error("Error type: " + exceptionType);
    this.cameraLogsService.addCameraLog(error, exceptionType);
  }

  //TODO no funciona en canviar a ruta germana

}
