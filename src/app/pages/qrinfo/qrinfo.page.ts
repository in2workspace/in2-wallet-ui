import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { QRCodeModule } from 'angular2-qrcode';
import { Route, Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-qrinfo',
  templateUrl: './qrinfo.page.html',
  styleUrls: ['./qrinfo.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,QRCodeModule]
})
export class QRInfoPage implements OnInit {
  //qr:string ="eyJraWQiOiJkaWQ6a2V5OnpEbmFlUms5ZWluQmFKMUJGMUcyZVZ4TkN1b3JaU2FkZ0ZORlVMeWZSdFg1M2dodWMjekRuYWVSazllaW5CYUoxQkYxRzJlVnhOQ3VvclpTYWRnRk5GVUx5ZlJ0WDUzZ2h1YyIsInR5cCI6IkpXVCIsImFsZyI6IkVTMjU2In0.eyJzdWIiOiJkaWQ6a2V5OnpEbmFlWXlaMUd1TnNoZjQ1RGo5Z0VURFNZNUM3dkJOS2hrdXczYTNDWGRUMktwQmEiLCJuYmYiOjE2ODE4MTIwNDEsImlzcyI6ImRpZDprZXk6ekRuYWVSazllaW5CYUoxQkYxRzJlVnhOQ3VvclpTYWRnRk5GVUx5ZlJ0WDUzZ2h1YyIsImlhdCI6MTY4MTgxMjA0MSwidmMiOnsiY3JlZGVudGlhbFNjaGVtYSI6eyJpZCI6Imh0dHBzOi8vZG9tZS5ldS9zY2hlbWFzL0N1c3RvbWVyQ3JlZGVudGlhbC9zY2hlbWEuanNvbiIsInR5cGUiOiJGdWxsSnNvblNjaGVtYVZhbGlkYXRvcjIwMjEifSwiY3JlZGVudGlhbFN1YmplY3QiOnsiZmFtaWx5TmFtZSI6Imd1YXJkaW9sYSIsImZpcnN0TmFtZSI6InBlcCIsImlkIjoiZGlkOmtleTp6RG5hZVl5WjFHdU5zaGY0NURqOWdFVERTWTVDN3ZCTktoa3V3M2EzQ1hkVDJLcEJhIn0sImlzc3VhbmNlRGF0ZSI6IlRodSBNYXIgMzAgMTA6Mjc6NDIgVVRDIDIwMjMiLCJpZCI6InVybjp1dWlkOjRhY2Q2YjY4LWVlZTQtNGVlMy05OTQ5LTU4YWI5OTYyZTA2YSIsInZhbGlkRnJvbSI6IjIwMjMtMDQtMThUMTA6MDA6NDFaIiwiaXNzdWVkIjoiMjAyMy0wNC0xOFQxMDowMDo0MVoiLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiQ3VzdG9tZXJDcmVkZW50aWFsIl0sIkBjb250ZXh0IjpbImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIl0sImlzc3VlciI6ImRpZDprZXk6ekRuYWVSazllaW5CYUoxQkYxRzJlVnhOQ3VvclpTYWRnRk5GVUx5ZlJ0WDUzZ2h1YyJ9LCJqdGkiOiJ1cm46dXVpZDo0YWNkNmI2OC1lZWU0LTRlZTMtOTk0OS01OGFiOTk2MmUwNmEifQ.QPeAG0yW7Rv9UaHgoeo32shkR6Nvm8GQY0I1QPViSuHP9LqpYVTLBiXa2Cxm2lS5BLWNFfoGbHqGl4Pxsd8gjA"
  qr:string ="";
  constructor(private route: ActivatedRoute,private storageService:StorageService) { 
    this.route.queryParams.subscribe(params => {
      this.qr = params['token']
  })
}
  
  tamano:number = 400
  ngOnInit() {
    
  }
  saveCredential(){
    this.storageService.set(this.qr)
  }
}
