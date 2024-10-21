import { ChangeDetectorRef, Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BarcodeScannerComponent } from '../../components/barcode-scanner/barcode-scanner.component';
import { CameraService } from 'src/app/services/camera.service';
import { TranslateModule } from '@ngx-translate/core';
import { distinctUntilChanged, filter, map, shareReplay, tap } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({
  selector: 'app-camera-selector',
  templateUrl: './camera-selector.page.html',
  styleUrls: ['./camera-selector.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TranslateModule,
    BarcodeScannerComponent,
  ],
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class CameraSelectorPage {
  @Input() public availableDevices: MediaDeviceInfo[] = [];
  public cameraService = inject(CameraService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  public showBarcode = true;
  private componentIsInitialized = false;

  public selectedDevice$ = this.cameraService.navCamera$.pipe(
    map((device) => {
      return device?.deviceId ?? 'Default';
    }),
    distinctUntilChanged(),
    shareReplay(1)
  );

  constructor(){
    this.router.events
    .pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntilDestroyed()
    )
    .subscribe((event: NavigationEnd) => {
      if (this.componentIsInitialized &&
        event.urlAfterRedirects.startsWith('/tabs/camera-selector')) {
       this.resetBarcode();
      }else{
        this.componentIsInitialized = true;
      }
    });
  }

  public resetBarcode(){
    console.log('reset barcode from selector')
    this.showBarcode = false;
    this.cdr.detectChanges();
    this.showBarcode = true;
  }
  

  public availableDevicesEmit(devices: MediaDeviceInfo[]) {
    if (devices.length <= 1) {
      this.availableDevices = devices;
      return;
    }
    
    //prioritize rear cameras
    const selectedDevices = devices.filter(device => /back|rear|environment/gi.test(device.label));
    this.availableDevices = selectedDevices.length > 0 ? selectedDevices : devices;
  }

  public onDeviceSelectChange(selected: string) {
    if (selected != '') {
      const device: MediaDeviceInfo | undefined = this.availableDevices.find(
        (x) => x.deviceId === selected
      );
      if (device != undefined) {
        this.cameraService.changeCamera(device);
      }
    } else {
      this.cameraService.noCamera();
    }
  }
}
