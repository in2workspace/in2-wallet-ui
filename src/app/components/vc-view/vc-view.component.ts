import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { QRCodeModule } from 'angular2-qrcode';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

export interface VerifiableCredential {
  credentialSubject: {
    mobile_phone: string;
    email: string;
    title: string;
    first_name: string;
    last_name: string;
    dateOfBirth: string;
    gender: string;
  };
  id: string;
  vcType: ['', ''];
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
      mobile_phone: '',
      email: '',
      title: '',
      first_name: '',
      last_name: '',
      dateOfBirth: '',
      gender: '',
    },
    id: '',
    vcType: ['', ''],
  };
  cred: VerifiableCredential = {
    credentialSubject: {
      mobile_phone: '',
      email: '',
      title: '',
      first_name: '',
      last_name: '',
      dateOfBirth: '',
      gender: '',
    },
    id: '',
    vcType: ['', ''],
  };
  vcType = '';
  @Output() vcEmit: EventEmitter<VerifiableCredential> = new EventEmitter();

  constructor(public translate: TranslateService) {}

  isAlertOpenNotFound = false;
  isAlertOpenDeleteNotFound = false;

  ngOnInit(): void {
    this.cred = this.credentialInput;
    console.log(this.cred);
    console.log(typeof this.cred['vcType'][0]);
    let i = 0;
    const v_cred: string = 'VerifiableCredential';
    const v_atest: string = 'VerifiableAttestation';
    while (i < this.cred.vcType.length) {
      if (
        this.cred['vcType'][i] !== v_cred &&
        this.cred['vcType'][i] !== v_atest
      ) {
        this.vcType = this.cred['vcType'][i];
        console.log(this.vcType);
      }
      i++;
    }
  }
  qrView() {
    this.isModalOpen = true;
  }
  isModalOpen = false;
  deleteView() {
    this.isModalDeleteOpen = true;
  }
  isModalDeleteOpen = false;
  deleteVC() {
    this.isModalDeleteOpen = true;
  }
  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  handlerMessage = '';
  public alertButtons = [
    {
      text: 'OK',
      role: 'confirm',
      handler: () => {
        this.handlerMessage = 'Alert confirmed';
        this.isModalOpen = true;
      },
    },
  ];

  public deleteButtons = [
    {
      text: this.translate.instant('vc-view.delete-cancel'),
      role: 'cancel',
      cssClass: 'cancel-button',
      handler: () => {
        this.isModalDeleteOpen = false;
      },
    },
    {
      text: this.translate.instant('vc-view.delete-confirm'),
      role: 'confirm',
      handler: () => {
        this.isModalDeleteOpen = true;
        this.vcEmit.emit(this.cred);
      },
    },
  ];
  setOpenNotFound(isOpen: boolean) {
    this.isAlertOpenNotFound = isOpen;
  }
  setOpenDeleteNotFound(isOpen: boolean) {
    this.isAlertOpenDeleteNotFound = isOpen;
  }
}
