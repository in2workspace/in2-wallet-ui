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
export class CameraSelectorPage {
  private cameraService = inject(CameraService);
  selectedDevice = this.cameraService.navCamera$.pipe(
    map((device) => {
    return device.deviceId;
  }),
    distinctUntilChanged(),
    shareReplay(1)
  );
  @Input() availableDevices: MediaDeviceInfo[] = []; 
  availableDevicesEmit(devices: MediaDeviceInfo[]) {
    this.availableDevices = devices;
  }
  onDeviceSelectChange(selected: string) {
    if (selected != '') {
      const device:MediaDeviceInfo|undefined = this.availableDevices.find((x) => x.deviceId === selected);
      if(device!=undefined){
        this.cameraService.changeCamera(device);
      }
    }
    else{
      this.cameraService.noCamera();
    }
  }
}
