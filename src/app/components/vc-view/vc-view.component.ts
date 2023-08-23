import {
  Component, Input, OnInit,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { QRCodeModule } from 'angular2-qrcode';

export interface VerifiableCredential{
  credentialSubject:{firstName:string,familyName:string,dateOfBirth:string,gender:string},
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

  @Input() credentialInput: VerifiableCredential = {credentialSubject:{firstName:"",familyName:"",dateOfBirth:"",gender:""},id:"",vcType:['','']} ;
  cred: VerifiableCredential ={credentialSubject:{firstName:"",familyName:"",dateOfBirth:"",gender:""},id:"",vcType:['','']};

  isAlertOpenNotFound=false;

  ngOnInit(): void {
    this.cred = this.credentialInput
    }
    qrView(){
      this.isAlertOpenNotFound = true;
    }
    isModalOpen = false;

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }
    handlerMessage = ''
    public alertButtons = [{      text: 'OK',
    role: 'confirm',
    handler: () => {
      this.handlerMessage = 'Alert confirmed';
      this.isModalOpen=true;
    }}];
  setOpenNotFound(isOpen: boolean) {
    this.isAlertOpenNotFound = isOpen;
    }
    }
