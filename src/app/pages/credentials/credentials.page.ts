import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { QRCodeModule } from 'angular2-qrcode';
import { WalletService } from 'src/app/services/wallet.service';
import { VcViewComponent, VerifiableCredential } from "../../components/vc-view/vc-view.component";

@Component({
    selector: 'app-credentials',
    templateUrl: './credentials.page.html',
    standalone: true,
    providers: [StorageService],
    imports: [IonicModule, CommonModule, FormsModule, QRCodeModule, VcViewComponent]
})

export class CredentialsPage implements OnInit {
  credList:Array<VerifiableCredential>=[];
  tamano:number=300;
  credDataList: any[]=[];
  @Input() availableDevices: MediaDeviceInfo[] = [];
  currentDevice: any;
  constructor(private walletService:WalletService) { 

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
