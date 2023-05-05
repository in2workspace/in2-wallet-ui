import { Component, Input, OnInit } from '@angular/core';
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
import { CameraService } from 'src/app/services/camera.service';

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
  URL_TOKEN = 7;
  toggleScan: boolean = false;
  startScan() {
    this.toggleScan = true;
  }
  @Input() availableDevices: MediaDeviceInfo[] = [];

  currentDevice: MediaDeviceInfo = {
    deviceId: '',
    groupId: '',
    kind: 'audiooutput',
    label: '',
    toJSON() {},
  };

  desactivar: boolean = true;
  constructor(
    private cameraService: CameraService,
    private router: Router,
    private storageService: StorageService,
    private walletService: WalletService,
   
  ) {}
  availableDevicesEmit(devices: MediaDeviceInfo[]) {
    this.availableDevices = devices;
  }
  ngOnInit(): void {    this.desactivar = false;
  }
  onDeviceSelectChange(selected: string) {
    if (selected != '') {
      const device:MediaDeviceInfo|undefined = this.availableDevices.find((x) => x.deviceId === selected);
      this.cameraService.camara=device;
      device != undefined ? (this.currentDevice = device) : false;
      this.desactivar = true;
    } else {
      this.currentDevice = {
        deviceId: '',
        groupId: '',
        kind: 'audiooutput',
        label: '',
        toJSON() {},
      };
      this.desactivar = false;
    }
  }
  qrCodeEmit(qrCode: string) {
    let qrType = this.detectQRtype(qrCode);
    let qrData = qrCode;
    if (qrType == this.QR_AUTH_API)
      this.walletService
        .executeURL(qrData)
        .subscribe((data) => {
          console.log("data",data);
          this.router.navigate(['/vc-selector/'], {
            queryParams: { state: qrData.split('state=')[1], type:data.auth_request },

          });
        });
        else if (qrType == this.QR_TOKEN)
      this.router.navigate(['/qrinfo/'], {
        queryParams: { token: qrData },
      });
    else if (qrType == this.URL_TOKEN)
    this.walletService
        .executeURLTOKEN(qrData)
        .subscribe({
          next: (res2:any) => {
            let headers = res2.headers;
            let locationHeader = headers.get('Location');
            console.log(locationHeader)
          this.router.navigate(['/qrinfo/'], {
            queryParams: { token: locationHeader },
          });}
        });

  }
  detectQRtype(qrData: string) {
    if (!qrData || !qrData.startsWith) {
      return this.QR_UNKNOWN;
    }
    else if (qrData.includes('issuerapidev')){
      return this.URL_TOKEN;
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


  // excuteVC(){
  //   this.walletService.executeVC("eyJraWQiOiJkaWQ6a2V5OnpEbmFldUZ4WlExRkVyYnpKWEx3TFZ3UHVUekFmamVzRzhFNnl6eHQxMTJhVnJ0OGoiLCJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJhdXRoX3JlcXVlc3QiOiJvcGVuaWQ6Ly8_c2NvcGU9Q3VzdG9tZXJDcmVkZW50aWFsJnJlc3BvbnNlX3R5cGU9dnBfdG9rZW4mcmVzcG9uc2VfbW9kZT1kaXJlY3RfcG9zdCZjbGllbnRfaWQ9ZGlkOmtleTp6RG5hZXVGeFpRMUZFcmJ6SlhMd0xWd1B1VHpBZmplc0c4RTZ5enh0MTEyYVZydDhqJnN0YXRlPXdhVUJ5c3MyU3ZPNHR0V2F1M2R0N1Embm9uY2U9OGYzYjUzOTQtN2FjMC00NDEyLWFjZGMtYjQwZmM0YmMxNGYwJnJlZGlyZWN0X3VyaT1odHRwOi8vbG9jYWxob3N0OjgwODIvYXBpL3ZlcmlmaWVyL3Npb3Atc2Vzc2lvbnMiLCJzdWIiOiJkaWQ6a2V5OnpEbmFldUZ4WlExRkVyYnpKWEx3TFZ3UHVUekFmamVzRzhFNnl6eHQxMTJhVnJ0OGoiLCJhdWQiOiJodHRwczovL3NlbGYtaXNzdWVkLm1lL3YyIiwiaXNzIjoiZGlkOmtleTp6RG5hZXVGeFpRMUZFcmJ6SlhMd0xWd1B1VHpBZmplc0c4RTZ5enh0MTEyYVZydDhqIiwiZXhwIjoxNjgzMTExMDc5LCJpYXQiOjE2ODMxMTA0Nzl9.0QIUGBruoAPEBlU-B8V8sHtEhGkK8wni6_KqDA2Qcy_3RyOH6hGOXGR3Q2elFt7pZyssPdHy3ME22k5QxDjosA",["eyJraWQiOiJkaWQ6a2V5OnpEbmFlUms5ZWluQmFKMUJGMUcyZVZ4TkN1b3JaU2FkZ0ZORlVMeWZSdFg1M2dodWMjekRuYWVSazllaW5CYUoxQkYxRzJlVnhOQ3VvclpTYWRnRk5GVUx5ZlJ0WDUzZ2h1YyIsInR5cCI6IkpXVCIsImFsZyI6IkVTMjU2In0.eyJzdWIiOiJkaWQ6a2V5OnpEbmFlekFjZ0dLRmhNOVJqWHZVWUxnQTRVWDhaTVhXbzN2Z2VTemQzZGFMVU5lR0ciLCJuYmYiOjE2ODIwMTI4NTYsImlzcyI6ImRpZDprZXk6ekRuYWVSazllaW5CYUoxQkYxRzJlVnhOQ3VvclpTYWRnRk5GVUx5ZlJ0WDUzZ2h1YyIsImlhdCI6MTY4MjAxMjg1NiwidmMiOnsiY3JlZGVudGlhbFNjaGVtYSI6eyJpZCI6Imh0dHBzOi8vZG9tZS5ldS9zY2hlbWFzL0N1c3RvbWVyQ3JlZGVudGlhbC9zY2hlbWEuanNvbiIsInR5cGUiOiJGdWxsSnNvblNjaGVtYVZhbGlkYXRvcjIwMjEifSwiY3JlZGVudGlhbFN1YmplY3QiOnsiZmFtaWx5TmFtZSI6IkxpbiIsImZpcnN0TmFtZSI6Ikhhb3BlbmciLCJpZCI6ImRpZDprZXk6ekRuYWV6QWNnR0tGaE05UmpYdlVZTGdBNFVYOFpNWFdvM3ZnZVN6ZDNkYUxVTmVHRyJ9LCJpc3N1YW5jZURhdGUiOiJUaHUgTWFyIDMwIDEwOjI3OjQyIFVUQyAyMDIzIiwiaWQiOiJ1cm46dXVpZDoyY2I2OTQ1OS04ODNiLTQyMGUtYWIwNS0wYzIxOWUwODc4ZTciLCJ2YWxpZEZyb20iOiIyMDIzLTA0LTIwVDE3OjQ3OjM2WiIsImlzc3VlZCI6IjIwMjMtMDQtMjBUMTc6NDc6MzZaIiwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIkN1c3RvbWVyQ3JlZGVudGlhbCJdLCJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJpc3N1ZXIiOiJkaWQ6a2V5OnpEbmFlUms5ZWluQmFKMUJGMUcyZVZ4TkN1b3JaU2FkZ0ZORlVMeWZSdFg1M2dodWMifSwianRpIjoidXJuOnV1aWQ6MmNiNjk0NTktODgzYi00MjBlLWFiMDUtMGMyMTllMDg3OGU3In0.Yaeq9G6qoO3zPFBZIP7HgXLV5xQrnAFV0pxjQQsiGUQYRecQwVzgGgKoMv1i6UENys09f84Wo3ANKpatWvb5bQ"])
  //   .subscribe((data) => {console.log("data",data);});
  // }

  // excuteURL(){
  //   console.log("excuteURL");
  //   this.walletService.executeURL("http://localhost:8082/api/verifier/authentication-requests?state=OKt5uNN8Tjasj5F_CSPcbQ")
  //     .subscribe({next:(data) => {alert(data.requestToken);},
  //                 error:(err) => {console.log("err",err);},});
  // }
}
