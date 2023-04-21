import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { QRCodeModule } from 'angular2-qrcode';
import { WalletService } from 'src/app/services/wallet.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vc-selector',
  templateUrl: './vc-selector.page.html',
  styleUrls: ['./vc-selector.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,QRCodeModule],
  providers: [StorageService]
})
export class VcSelectorPage implements OnInit {

  credList:(string)[]=[];
  tamano:number=300;
  state:string="";
  constructor(private storageService:StorageService, private walletService:WalletService, private route:ActivatedRoute) { 
    this.route.queryParams.subscribe(params => {
      this.state = params['state']
  })
  }

  ngOnInit() {
   this.storageService.getAll()!=null?this.credList=this.storageService.getAll():[];
  }
  selectCred(cred:string){
    this.walletService.executeVC(this.state,[cred]);

  }
}
