import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BarcodeScannerComponent } from 'src/app/components/barcode-scanner/barcode-scanner.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

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
    RouterModule,
  ],
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class HomePage implements OnInit {
  @Input() public availableDevices: MediaDeviceInfo[] = [];
  public userName = '';
  public desactivar = true;

  public constructor(private router: Router, private route: ActivatedRoute) { }

  public async startScan() {
    try{
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      this.router.navigate(['/tabs/credentials/'], {
        queryParams: { toggleScan: true, from: 'home', show_qr: true },
      });
    }catch(err){
      alert('Error: ' + err);
    }
  }
  public handleButtonKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {

      this.startScan();
      event.preventDefault();
    }
  }
  public ngOnInit() {
    this.route.queryParams.subscribe((params) => { //Todo unsubscribe
      const credentialOfferUri = params['credential_offer_uri'];
      if (credentialOfferUri) {
        this.router.navigate(['/tabs/credentials'], {
          queryParams: { credentialOfferUri: credentialOfferUri },
        });
      }
    });
  }
}
