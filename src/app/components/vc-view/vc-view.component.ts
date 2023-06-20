import {
  Component, EventEmitter, Input, OnInit, Output,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { QRCodeModule } from 'angular2-qrcode';

export interface VerifiableCredential{
  credentialSubject:{firstName:string,familyName:string,nom:string,cognoms:string},
  id:string,
  vcType:['','']

}
@Component({
  selector: 'app-vc-view',
  templateUrl: './vc-view.component.html',
  styleUrls: ['./vc-view.component.scss'],
  standalone: true,
  imports: [IonicModule,QRCodeModule],
})
export class VcViewComponent implements OnInit{
  @Output() availableDevices: EventEmitter<MediaDeviceInfo[]> =
  new EventEmitter();
  @Output() qrCode: EventEmitter<string> =
  new EventEmitter();
  @Input() credentialInput: VerifiableCredential = {credentialSubject:{firstName:"",familyName:"",nom:"",cognoms:""},id:"",vcType:['','']} ;
  cred: VerifiableCredential ={credentialSubject:{firstName:"",familyName:"",nom:"",cognoms:""},id:"",vcType:['','']};
  constructor() { 
  }

  ngOnInit(): void {
    this.cred = this.credentialInput
    }
    }
