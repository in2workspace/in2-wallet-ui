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

  public showBarcode = true;
  public isChangingDevice = false;
  public availableDevices$ = this.cameraService.availableDevices$;
  public selectedDevice$ = this.cameraService.selectedCamera$;

  private ngOnInit():void{
    // console.log('SELECTOR (OnInit): showBarcode = ' + this.showBarcode);
  }

  private ionViewWillEnter(): void{
    // console.log('SELECTOR (IonViewWillEnter): showBarcode = ' + this.showBarcode);
    if(this.showBarcode !== true){
      // console.log('SELECTOR (IonViewWillEnter): createBarcode')
      this.createBarcode();
    }
    // else{
    //   console.log('SELECTOR (IonViewWillEnter): barcode is already created (showbarcode = true): ')
    // }
  }

  private async ionViewWillLeave(): Promise<void>{
    // console.log('SELECTOR: Leaving-destroyBarcode')
    this.destroyBarcode();
  }

  public async onDeviceSelectChange(selectedDeviceId: string): Promise<void> {
    //todo moure a servei
    // console.log('SELECTOR: onDeviceSelectChange');
    this.showIsChangingDeviceTemp();
    const availableDevices = await this.cameraService.updateAvailableCameras();
    if(availableDevices.length === 0){
      this.handleCameraErrorAndReload();
      return;
    }
    // console.log('SELECTOR: onDeviceSelectChange: updateAvailableCameras')
    const isAvailable = this.cameraService.isCameraAvailableById(selectedDeviceId);
    if(isAvailable){
      const selectedDevice = this.cameraService.getAvailableCameraById(selectedDeviceId);
      this.cameraService.setCamera(selectedDevice);
    }else{
      this.handleCameraErrorAndReload();
    }
}

  public handleCameraErrorAndReload(): void{
    this.cameraService.handleCameraErrors({name: 'CustomNoAvailable'}, 'fetchError');
    //todo anything else?
  }

  public showIsChangingDeviceTemp(): void{
    this.isChangingDevice = true;
    setTimeout(()=>{
      this.isChangingDevice = false;
    }, 2000);
  }

  public createBarcode(): void{
    this.showBarcode = true;
    this.cdr.detectChanges();
  }

  public destroyBarcode(): void{
    this.showBarcode = false;
    this.cdr.detectChanges();
  }
  

}