import {
  Component, Input, OnInit,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { QRCodeModule } from 'angular2-qrcode';

export interface VerifiableCredential{
  credentialSubject:{first_name:string,last_name:string,dateOfBirth:string,gender:string},
  id:string,
  vcType:['','']

}
@Component({
  selector: 'app-vc-view',
  templateUrl: './vc-view.component.html',
  standalone: true,
  imports: [IonicModule,QRCodeModule],
})
export class VcViewComponent implements OnInit{

  @Input() credentialInput: VerifiableCredential = {credentialSubject:{first_name:"",last_name:"",dateOfBirth:"",gender:""},id:"",vcType:['','']} ;
  cred: VerifiableCredential ={credentialSubject:{first_name:"",last_name:"",dateOfBirth:"",gender:""},id:"",vcType:['','']};


  ngOnInit(): void {
    this.cred = this.credentialInput
    }
    }
