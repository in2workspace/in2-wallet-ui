import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule, PopoverController} from '@ionic/angular';
import {BarcodeScannerComponent} from 'src/app/components/barcode-scanner/barcode-scanner.component';
import {ActivatedRoute, Router, RouterModule } from '@angular/router';
import {WalletService} from 'src/app/services/wallet.service';
import {AuthenticationService} from 'src/app/services/authentication.service';
import {TranslateModule} from '@ngx-translate/core';
import {LogoutPage } from '../logout/logout.page';

const TIME_IN_MS = 1500;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
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
export class HomePage implements OnInit {

  async startScan() {
    this.router.navigate(['/tabs/credentials/'], {
      queryParams: { toggleScan: true, from: 'home', show_qr: true },
    });
  }


  @Input() availableDevices: MediaDeviceInfo[] = [];

  userName: string = '';
  desactivar: boolean = true;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private popoverController: PopoverController,
    private route: ActivatedRoute,
    ) {
  }

  async openPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: LogoutPage, 
      event: ev,
      translucent: true,
    });
  }
  ngOnInit() {
    this.userName = this.authenticationService.getName();

  }

  logout(){
    this.authenticationService.logout().subscribe(()=>{
      this.router.navigate(['/login'], {})

    });
  }

}
