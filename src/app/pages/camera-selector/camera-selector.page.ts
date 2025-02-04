import { ChangeDetectorRef, Component, Input, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BarcodeScannerComponent } from '../../components/barcode-scanner/barcode-scanner.component';
import { CameraService } from 'src/app/services/camera.service';
import { TranslateModule } from '@ngx-translate/core';
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
  private cdr = inject(ChangeDetectorRef);

  public showBarcode = true;
  public availableDevices$ = this.cameraService.availableDevices$;
  public selectedDevice$ = this.cameraService.selectedCamera$;


  public async onDeviceSelectChange(selectedDeviceId: string) {
    console.log('SELECTOR: onDeviceSelectChange')
    await this.cameraService.updateAvailableCameras();
    console.log('SELECTOR: onDeviceSelectChange: updateAvailableCameras')
    const isAvailable = this.cameraService.isCameraAvailableById(selectedDeviceId);
    if(isAvailable){
      const selectedDevice = this.cameraService.getAvailableCameraById(selectedDeviceId);
      this.cameraService.setCamera(selectedDevice);
    }else{
      alert('Selected camera is not available.');
      location.reload();
    }
}

  public createBarcode(){
    this.showBarcode = true;
    this.cdr.detectChanges();
  }

  public destroyBarcode(){
    this.showBarcode = false;
    this.cdr.detectChanges();
  }
  
  ionViewWillEnter(){
    this.createBarcode();
  }

  async ionViewWillLeave(){
    this.destroyBarcode();
  }

}