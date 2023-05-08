import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { QRCodeModule } from 'angular2-qrcode';
import { WalletService } from 'src/app/services/wallet.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-vc-selector',
  templateUrl: './vc-selector.page.html',
  styleUrls: ['./vc-selector.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,QRCodeModule],
  providers: [StorageService]
})
export class VcSelectorPage implements OnInit {
  isClick: (boolean)[]=[];

  isClicked(index:number){
   return this.isClick[index];
  }
  



  selCredList:(string)[]=[];
  credList:(string)[]=[];
  credDataList:(any)[]=[];
  tamano:number=300;
  state:string="";
  type: any;
  token:any;
  constructor(    private router: Router,
    private storageService:StorageService, private walletService:WalletService, private route:ActivatedRoute) { 
    this.route.queryParams.subscribe(params => {
      this.state = params['state'];
      this.token = params['type']
      this.type = params['type'].split('[')[1].split(']')[0].split(', ')
  })
  
  }

  ngOnInit() {
   this.storageService.getAll()!=null?this.credList=this.storageService.getAll():[];
   this.credList.forEach(data =>{
    this.credDataList.push(JSON.parse(atob(data.split('.')[1]))['vc']);
    this.isClick.push(false);
   })
  }
  selectCred(cred:string, index : number){
    this.selCredList.push(cred);
    this.isClick[index]=!this.isClick[index];

  }
  sendCred(){
    this.walletService.executeVC(this.token,this.selCredList).subscribe(data=>{
      this.isAlertOpen = true;
      this.isAlertOpen = true;     
      let TIME_IN_MS = 1500;
      let hideFooterTimeout = setTimeout( () => {
  this.isAlertOpen = false;      
 }, TIME_IN_MS);
  setTimeout( () => { this.router.navigate(['/home'])},2000);
    },
    err => {
      let TIME_IN_MS = 1500;
      let hideFooterTimeout = setTimeout( () => {
  this.isAlertOpenFail = false;      }, TIME_IN_MS);
      this.isAlertOpenFail = true;

    });

  }
  isAlertOpenFail = false;

  isAlertOpen = false;
  public alertButtons = ['OK'];

  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }
  isType(index:number)
  {
    return this.type.find((element: any) => element ==this.credDataList[index]['type'][1])!= undefined;
  }
}
