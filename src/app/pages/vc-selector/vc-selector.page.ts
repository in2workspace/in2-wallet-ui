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
   //this.storageService.getAll()!=null?this.credList=this.storageService.getAll():[];
   this.credList=["eyJraWQiOiJkaWQ6a2V5OnpEbmFlUms5ZWluQmFKMUJGMUcyZVZ4TkN1b3JaU2FkZ0ZORlVMeWZSdFg1M2dodWMjekRuYWVSazllaW5CYUoxQkYxRzJlVnhOQ3VvclpTYWRnRk5GVUx5ZlJ0WDUzZ2h1YyIsInR5cCI6IkpXVCIsImFsZyI6IkVTMjU2In0.eyJzdWIiOiJkaWQ6a2V5OnpEbmFlekFjZ0dLRmhNOVJqWHZVWUxnQTRVWDhaTVhXbzN2Z2VTemQzZGFMVU5lR0ciLCJuYmYiOjE2ODIwMTI4NTYsImlzcyI6ImRpZDprZXk6ekRuYWVSazllaW5CYUoxQkYxRzJlVnhOQ3VvclpTYWRnRk5GVUx5ZlJ0WDUzZ2h1YyIsImlhdCI6MTY4MjAxMjg1NiwidmMiOnsiY3JlZGVudGlhbFNjaGVtYSI6eyJpZCI6Imh0dHBzOi8vZG9tZS5ldS9zY2hlbWFzL0N1c3RvbWVyQ3JlZGVudGlhbC9zY2hlbWEuanNvbiIsInR5cGUiOiJGdWxsSnNvblNjaGVtYVZhbGlkYXRvcjIwMjEifSwiY3JlZGVudGlhbFN1YmplY3QiOnsiZmFtaWx5TmFtZSI6IkxpbiIsImZpcnN0TmFtZSI6Ikhhb3BlbmciLCJpZCI6ImRpZDprZXk6ekRuYWV6QWNnR0tGaE05UmpYdlVZTGdBNFVYOFpNWFdvM3ZnZVN6ZDNkYUxVTmVHRyJ9LCJpc3N1YW5jZURhdGUiOiJUaHUgTWFyIDMwIDEwOjI3OjQyIFVUQyAyMDIzIiwiaWQiOiJ1cm46dXVpZDoyY2I2OTQ1OS04ODNiLTQyMGUtYWIwNS0wYzIxOWUwODc4ZTciLCJ2YWxpZEZyb20iOiIyMDIzLTA0LTIwVDE3OjQ3OjM2WiIsImlzc3VlZCI6IjIwMjMtMDQtMjBUMTc6NDc6MzZaIiwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIkN1c3RvbWVyQ3JlZGVudGlhbCJdLCJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJpc3N1ZXIiOiJkaWQ6a2V5OnpEbmFlUms5ZWluQmFKMUJGMUcyZVZ4TkN1b3JaU2FkZ0ZORlVMeWZSdFg1M2dodWMifSwianRpIjoidXJuOnV1aWQ6MmNiNjk0NTktODgzYi00MjBlLWFiMDUtMGMyMTllMDg3OGU3In0.Yaeq9G6qoO3zPFBZIP7HgXLV5xQrnAFV0pxjQQsiGUQYRecQwVzgGgKoMv1i6UENys09f84Wo3ANKpatWvb5bQ"]
  }
  selectCred(cred:string){
    this.walletService.executeVC("OnjnU-Y3SM255NdeSF7aNw",[cred]).subscribe(data=>{
      this.isAlertOpen = true;

    },
    err => {
      this.isAlertOpenFail = true;

    });

  }
  isAlertOpenFail = false;

  isAlertOpen = false;
  public alertButtons = ['OK'];

  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }
}
