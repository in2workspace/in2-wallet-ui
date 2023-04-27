import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BarcodeScannerComponent } from 'src/app/components/barcode-scanner/barcode-scanner.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { WalletService } from 'src/app/services/wallet.service';

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
    ZXingScannerModule,
  ],
})
export class HomePage implements OnInit {
  QR_UNKNOWN = 0;
  QR_URL = 1;
  QR_MULTI = 2;
  QR_HC1 = 3;
  QR_TOKEN = 4;
  QR_AUTH = 5;
  QR_AUTH_API = 6;
  toggleScan: boolean = false;
  startScan() {
    this.toggleScan = true;
  }
  constructor(
    private router: Router,
    private storageService: StorageService,
    private walletService: WalletService
  ) {}

  ngOnInit(): void {}
  qrCodeEmit(qrCode: string) {
    let qrType = this.detectQRtype(qrCode);
    let qrData = qrCode;
    if (qrType == this.QR_AUTH_API)
      this.walletService
        .executeQR(qrData.split('state=')[1])
        .subscribe((data) => {
          this.router.navigate(['/vc-selector/'], {
            queryParams: { state: qrData.split('state=')[1],data },
          });
        });
    else if (qrType == this.QR_TOKEN)
      this.router.navigate(['/qrinfo/'], {
        queryParams: { token: qrData },
      });
  }
  detectQRtype(qrData: string) {
    if (!qrData || !qrData.startsWith) {
      return this.QR_UNKNOWN;
    } else if (qrData.includes('domeapidev')) {
      return this.QR_AUTH_API;
    } else if (qrData.startsWith('https') || qrData.startsWith('http')) {
      // Normal QR with a URL where the real data is located
      // We require secure connections with https
      return this.QR_URL;
    } else if (qrData.startsWith('ey')) {
      // JWT
      return this.QR_TOKEN;
    } else if (qrData.startsWith('{"response_type"')) {
      // JWT
      return this.QR_AUTH;
    } else {
      return this.QR_UNKNOWN;
    }
  }
}
