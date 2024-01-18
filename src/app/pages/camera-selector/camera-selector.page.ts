import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule, PopoverController} from '@ionic/angular';
import {BarcodeScannerComponent} from '../../components/barcode-scanner/barcode-scanner.component';
import {CameraService} from 'src/app/services/camera.service';
import {AuthenticationService} from 'src/app/services/authentication.service';
import {LogoutPage } from '../logout/logout.page';
import {TranslateModule} from '@ngx-translate/core';
import {ActivatedRoute, Router,RouterModule} from '@angular/router';

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
    TranslateModule,
    RouterModule
  ],
})
export class CameraSelectorPage {
  selectedDevice: string = '';
  userName: string = '';
  @Input() availableDevices: MediaDeviceInfo[] = []; 
  constructor( private cameraService:CameraService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private popoverController: PopoverController,
  ) {}

  ngOnInit() {
    this.userName = this.authenticationService.getName();
  }

  availableDevicesEmit(devices: MediaDeviceInfo[]) {
    this.availableDevices = devices;
  }

  // todo: Simplify function and pass logic to the service
  onDeviceSelectChange(selected: string) {
    this.selectedDevice = selected;
    if (selected != '') {
      const device: MediaDeviceInfo | undefined = this.availableDevices.find((x) => x.deviceId === selected);
      if (device != undefined) {
        this.cameraService.changeCamera(device);
      }
    } else {
      this.cameraService.noCamera();
    }
  }

  logout(){
    this.authenticationService.logout().subscribe(()=>{
      this.router.navigate(['/login'], {})

    });
  }

  async openPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: LogoutPage, 
      event: ev,
      translucent: true,
      cssClass: 'custom-popover'
    });
  
    await popover.present();
  }

}
