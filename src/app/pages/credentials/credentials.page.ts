import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { QRCodeModule } from 'angular2-qrcode';
import { WalletService } from 'src/app/services/wallet.service';
import { VcViewComponent, VerifiableCredential } from "../../components/vc-view/vc-view.component";
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-credentials',
    templateUrl: './credentials.page.html',
    standalone: true,
    providers: [StorageService],
    imports: [IonicModule, CommonModule, FormsModule, QRCodeModule, VcViewComponent,TranslateModule]
})

export class CredentialsPage implements OnInit {
  credList:Array<VerifiableCredential>=[];
  tamano:number=300;
  credDataList: any[]=[];
  @Input() availableDevices: MediaDeviceInfo[] = [];
  currentDevice: any;
  private walletService = inject(WalletService);
  constructor() { 

  }

  ngOnInit() {
    this.refresh()
  
  }
  refresh(){
    this.walletService.getAllVCs().subscribe((credentialListResponse:Array<VerifiableCredential>) => {
      this.credList=credentialListResponse;
     })
  }
  vcDelete(cred: VerifiableCredential) {
    this.walletService.deleteVC(cred.id).subscribe((response:any) => {
      console.log(response)
      this.refresh()

     })
  }
}
