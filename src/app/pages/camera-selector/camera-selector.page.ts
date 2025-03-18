import { ChangeDetectorRef, Component, inject } from '@angular/core';
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
  public readonly cameraService = inject(CameraService);
  private readonly cdr = inject(ChangeDetectorRef);

  public showScanner = true;
  public isChangingDevice = false;
  public availableDevices$ = this.cameraService.availableDevices$;
  public selectedDevice$ = this.cameraService.selectedCamera$;

  private ionViewWillEnter(): void{
    if(this.showScanner !== true){
      this.createScanner();
    }
  }

  private async ionViewWillLeave(): Promise<void>{
    this.destroyScanner();
  }

  public async onDeviceSelectChange(selectedDeviceId: string): Promise<void> {
    this.showIsChangingDeviceTemp();
    const availableDevices = await this.cameraService.updateAvailableCameras();
    if(availableDevices.length === 0){
      this.handleCameraError();
      return;
    }
    const isAvailable = this.cameraService.isCameraAvailableById(selectedDeviceId);
    if(isAvailable){
      const selectedDevice = this.cameraService.getAvailableCameraById(selectedDeviceId);
      this.cameraService.setCamera(selectedDevice);
    }else{
      this.handleCameraError();
    }
}

  public handleCameraError(): void{
    this.cameraService.handleCameraErrors({name: 'CustomNoAvailable'}, 'fetchError');
  }

  public showIsChangingDeviceTemp(): void{
    this.isChangingDevice = true;
    setTimeout(()=>{
      this.isChangingDevice = false;
    }, 2000);
  }

  public createScanner(): void{
    this.showScanner = true;
    this.cdr.detectChanges();
  }

  public destroyScanner(): void{
    this.showScanner = false;
    this.cdr.detectChanges();
  }
  

}