import { ChangeDetectorRef, Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BarcodeScannerComponent } from '../../components/barcode-scanner/barcode-scanner.component';
import { CameraService } from 'src/app/services/camera.service';
import { TranslateModule } from '@ngx-translate/core';
import { distinctUntilChanged, filter, map, shareReplay, tap } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
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
    BarcodeScannerComponent
  ],
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class CameraSelectorPage {
  public cameraService = inject(CameraService);

  public showBarcode = true;
  public availableDevices$ = this.cameraService.availableDevices$;
  public selectedDevice$ = toObservable(this.cameraService.selectedCamera$);

  constructor(){  }

  public async onDeviceSelectChange(selectedDevice: MediaDeviceInfo) {
    //comprovar si la càmera és available: updateAvailable
    //si és available, actualitzar selectedCamera
    await this.cameraService.updateAvailableCameras();
    const isAvailable = this.cameraService.isCameraAvailableById(selectedDevice.deviceId);
    if(isAvailable){
      this.cameraService.changeCamera(selectedDevice);
    }else{
      alert('Selected camera is not available.');
      location.reload();
    }
}

  public createBarcode(){
    console.log('turn on barcode from selector')
    this.showBarcode = true;
  }

  public destroyBarcode(){
    console.log('turnf off barcode from selector')
    this.showBarcode = false;
  }

  ionViewWillEnter(){
    console.log('ionViewWillEnter: camera-selector');
    this.createBarcode();
  }

  ionViewWillLeave(){
    console.log('ionViewWillLeave: camera-selector');
    this.destroyBarcode();
  }
}