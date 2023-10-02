import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BarcodeScannerComponent } from '../../components/barcode-scanner/barcode-scanner.component';
import { CameraService } from 'src/app/services/camera.service';
@Component({
  selector: 'app-camera-selector',
  templateUrl: './camera-selector.page.html',
  styleUrls: ['./camera-selector.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    BarcodeScannerComponent,
  ],
})
export class CameraSelectorPage {
  @Input() availableDevices: MediaDeviceInfo[] = []; 
  constructor( private cameraService:CameraService,
  ) {}

  availableDevicesEmit(devices: MediaDeviceInfo[]) {
    this.availableDevices = devices;
  }
  //TO-DO:Simplfy function and pass logic to the service
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
