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
          console.log("data",data);
          this.router.navigate(['/vc-selector/'], {
            queryParams: { state: qrData.split('state=')[1], type:data },
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
    } else if (qrData.startsWith('https') || qrData.startsWith('http')) {
      // Normal QR with a URL where the real data is located
      // We require secure connections with https
      return this.QR_AUTH_API;
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

  excuteQR(){
    this.walletService.executeQR("OnjnU-Y3SM255NdeSF7aNw").subscribe((data) => {console.log("data",data);});
  }

  excuteVC(){
    this.walletService.executeVC("OnjnU-Y3SM255NdeSF7aNw",["eyJraWQiOiJkaWQ6a2V5OnpEbmFlUms5ZWluQmFKMUJGMUcyZVZ4TkN1b3JaU2FkZ0ZORlVMeWZSdFg1M2dodWMjekRuYWVSazllaW5CYUoxQkYxRzJlVnhOQ3VvclpTYWRnRk5GVUx5ZlJ0WDUzZ2h1YyIsInR5cCI6IkpXVCIsImFsZyI6IkVTMjU2In0.eyJzdWIiOiJkaWQ6a2V5OnpEbmFlekFjZ0dLRmhNOVJqWHZVWUxnQTRVWDhaTVhXbzN2Z2VTemQzZGFMVU5lR0ciLCJuYmYiOjE2ODIwMTI4NTYsImlzcyI6ImRpZDprZXk6ekRuYWVSazllaW5CYUoxQkYxRzJlVnhOQ3VvclpTYWRnRk5GVUx5ZlJ0WDUzZ2h1YyIsImlhdCI6MTY4MjAxMjg1NiwidmMiOnsiY3JlZGVudGlhbFNjaGVtYSI6eyJpZCI6Imh0dHBzOi8vZG9tZS5ldS9zY2hlbWFzL0N1c3RvbWVyQ3JlZGVudGlhbC9zY2hlbWEuanNvbiIsInR5cGUiOiJGdWxsSnNvblNjaGVtYVZhbGlkYXRvcjIwMjEifSwiY3JlZGVudGlhbFN1YmplY3QiOnsiZmFtaWx5TmFtZSI6IkxpbiIsImZpcnN0TmFtZSI6Ikhhb3BlbmciLCJpZCI6ImRpZDprZXk6ekRuYWV6QWNnR0tGaE05UmpYdlVZTGdBNFVYOFpNWFdvM3ZnZVN6ZDNkYUxVTmVHRyJ9LCJpc3N1YW5jZURhdGUiOiJUaHUgTWFyIDMwIDEwOjI3OjQyIFVUQyAyMDIzIiwiaWQiOiJ1cm46dXVpZDoyY2I2OTQ1OS04ODNiLTQyMGUtYWIwNS0wYzIxOWUwODc4ZTciLCJ2YWxpZEZyb20iOiIyMDIzLTA0LTIwVDE3OjQ3OjM2WiIsImlzc3VlZCI6IjIwMjMtMDQtMjBUMTc6NDc6MzZaIiwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIkN1c3RvbWVyQ3JlZGVudGlhbCJdLCJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJpc3N1ZXIiOiJkaWQ6a2V5OnpEbmFlUms5ZWluQmFKMUJGMUcyZVZ4TkN1b3JaU2FkZ0ZORlVMeWZSdFg1M2dodWMifSwianRpIjoidXJuOnV1aWQ6MmNiNjk0NTktODgzYi00MjBlLWFiMDUtMGMyMTllMDg3OGU3In0.Yaeq9G6qoO3zPFBZIP7HgXLV5xQrnAFV0pxjQQsiGUQYRecQwVzgGgKoMv1i6UENys09f84Wo3ANKpatWvb5bQ"])
    .subscribe((data) => {console.log("data",data);});
  }
}
