import {Component, EventEmitter, Input, OnInit, Output,} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {QRCodeModule} from 'angular2-qrcode';
import {TranslateModule} from '@ngx-translate/core';

export interface VerifiableCredential {
  credentialSubject: {
    mobile_phone: string,
    email: string,
    title: string,
    first_name: string,
    last_name: string,
    dateOfBirth: string,
    gender: string
  },
  id: string,
  vcType: ['', '']

}

@Component({
  selector: 'app-vc-view',
  templateUrl: './vc-view.component.html',
  standalone: true,
  imports: [IonicModule, QRCodeModule, TranslateModule],
})
export class VcViewComponent implements OnInit {

  @Input() credentialInput: VerifiableCredential = {
    credentialSubject: {
      mobile_phone: "",
      email: "",
      title: "",
      first_name: "",
      last_name: "",
      dateOfBirth: "",
      gender: ""
    }, id: "", vcType: ['', '']
  };
  cred: VerifiableCredential = {
    credentialSubject: {
      mobile_phone: "",
      email: "",
      title: "",
      first_name: "",
      last_name: "",
      dateOfBirth: "",
      gender: ""
    }, id: "", vcType: ['', '']
  };
  @Output() vcEmit: EventEmitter<VerifiableCredential> =
    new EventEmitter();


  isAlertOpenNotFound=false;
  isAlertOpenDeleteNotFound=false;

  ngOnInit(): void {
    this.cred = this.credentialInput
    }
    qrView(){
      this.isModalOpen = true;
    }
    isModalOpen = false;
    deleteView(){
      this.isModalDeleteOpen = true;
    }
    isModalDeleteOpen = false;
    deleteVC(){
      this.isModalDeleteOpen =true;
    }
  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  handlerMessage = ''
  public alertButtons = [{
    text: 'OK',
    role: 'confirm',
    handler: () => {
      this.handlerMessage = 'Alert confirmed';
      this.isModalOpen=true;
    }}];

    public deleteButtons = [{text: 'Cancel·la',
      role: 'cancel',
      cssClass: 'cancel-button',
      handler: () => {
        this.isModalDeleteOpen=false;
      }}, {text: 'Sí, elimina-la',
      role: 'confirm',
      handler: () => {
        this.isModalDeleteOpen=true;
        this.vcEmit.emit(this.cred);      
      }}]
  setOpenNotFound(isOpen: boolean) {
    this.isAlertOpenNotFound = isOpen;
    }
    setOpenDeleteNotFound(isOpen: boolean) {
      this.isAlertOpenDeleteNotFound = isOpen;
    }
    }
