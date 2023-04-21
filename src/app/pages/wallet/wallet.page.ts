import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { QRCodeModule } from 'angular2-qrcode';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,QRCodeModule],
  providers: [StorageService]
})

export class WalletPage implements OnInit {
  credList:(string)[]=[];
  tamano:number=300;
  credDataList: any[]=[];
  constructor(private storageService:StorageService) { }

  ngOnInit() {
   this.storageService.getAll()!=null?this.credList=this.storageService.getAll():[];
   this.credList.forEach(data =>{
    this.credDataList.push(JSON.parse(atob(data.split('.')[1]))['vc']);
   })
  }

}
