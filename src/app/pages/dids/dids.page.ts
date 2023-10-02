import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { QRCodeModule } from 'angular2-qrcode';
import { WalletService } from 'src/app/services/wallet.service';
import { DidViewComponent } from 'src/app/components/did-view/did-view.component';

@Component({
    selector: 'app-dids',
    templateUrl: './dids.page.html',
    standalone: true,
    providers: [StorageService],
    imports: [IonicModule, CommonModule, FormsModule, QRCodeModule, DidViewComponent]
})

export class DidsPage implements OnInit {
  didList:Array<any>=[];
  tamano:number=300;
  credDataList: any[]=[];
  @Input() availableDevices: MediaDeviceInfo[] = [];
  currentDevice: any;
  private walletService=inject(WalletService);
  constructor() { 
  }
refresh(){
  this.walletService.getAllDIDs().subscribe((didListResponse:Array<any>) => {
    this.didList=didListResponse;
   })
}
  ngOnInit() {
    this.refresh()

  }
  createDid(){
    this.walletService.postDid({"type":"key","value":null}).subscribe((response:any) => {
      console.log(response)
      this.refresh()

     },
     error=>{console.log(error)})
  }
  didDelete(did: string) {
    this.walletService.deleteDid(did).subscribe((response:any) => {
      console.log(response)
      this.refresh()

     })
  }
}
