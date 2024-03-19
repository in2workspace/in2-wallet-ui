import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule } from '@ionic/angular';
import {BarcodeScannerComponent} from 'src/app/components/barcode-scanner/barcode-scanner.component';
import {ActivatedRoute, Router, RouterModule } from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';


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
    private route: ActivatedRoute,
    ) {
  }


  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const credentialOfferUri = params['credential_offer_uri'];
      if (credentialOfferUri) {
        this.router.navigate(['/tabs/credentials'], {queryParams: { credentialOfferUri: credentialOfferUri}})
      }
    });
  }


}
