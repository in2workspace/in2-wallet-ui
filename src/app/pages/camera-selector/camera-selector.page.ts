import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BarcodeScannerComponent } from '../../components/barcode-scanner/barcode-scanner.component';
import { CameraService } from 'src/app/services/camera.service';
import { TranslateModule } from '@ngx-translate/core';
import { distinctUntilChanged, map, shareReplay } from 'rxjs';
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

  public selectedDevice = this.cameraService.navCamera$.pipe(
    map((device) => {
      return device.deviceId;
    }),
    distinctUntilChanged(),
    shareReplay(1)
  );

  public availableDevicesEmit(devices: MediaDeviceInfo[]) {
    if (devices.length <= 1) {
      this.availableDevices = devices;
    } else {
      //selects the devices's back camera by default
      const selectedDevices: MediaDeviceInfo[] = [];
      for (const device of devices) {
        if (/back|rear|environment/gi.test(device.label)) {
          selectedDevices.push(device);
          break;
        }
      }
      if (selectedDevices.length === 0) {
        this.availableDevices = devices;
      } else {
        this.availableDevices = selectedDevices;
      }
    }
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
