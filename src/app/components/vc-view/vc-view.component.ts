import {Component, EventEmitter, Input, OnInit, Output,} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {QRCodeModule} from 'angular2-qrcode';

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
  imports: [IonicModule, QRCodeModule],
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

  isAlertOpenNotFound = false;

  ngOnInit(): void {
    this.cred = this.credentialInput
  }

  qrView() {
    this.isAlertOpenNotFound = true;
  }

  isModalOpen = false;

  deleteVC() {
    this.vcEmit.emit(this.cred);

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
      this.isModalOpen = true;
    }
  }];

  setOpenNotFound(isOpen: boolean) {
    this.isAlertOpenNotFound = isOpen;
  }
  
}
