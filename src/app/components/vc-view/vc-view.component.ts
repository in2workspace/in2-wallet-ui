import {
  Component, EventEmitter, Input, OnInit, Output, inject,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { QRCodeModule } from 'angularx-qrcode';
import { WalletService } from 'src/app/services/wallet.service';
import { CommonModule } from '@angular/common';
import { TranslateModule} from '@ngx-translate/core';
import { VerifiableCredential } from 'src/app/interfaces/verifiable-credential';


@Component({
  selector: 'app-vc-view',
  templateUrl: './vc-view.component.html',
  standalone: true,
  imports: [IonicModule,QRCodeModule,TranslateModule,CommonModule],
})
export class VcViewComponent implements OnInit{
  private walletService = inject(WalletService);
  cred_cbor: string = ""
  constructor() {}
  @Input() credentialInput: VerifiableCredential = {credentialSubject:{mobile_phone:"",email:"",organizationalUnit:"",firstName:"",lastName:"",dateOfBirth:"",gender:""},id:"",expirationDate:new Date,vcType:['','']} ;
  cred: VerifiableCredential ={credentialSubject:{mobile_phone:"",email:"",organizationalUnit:"",firstName:"",lastName:"",dateOfBirth:"",gender:""},id:"",expirationDate:new Date,vcType:['','']};
  @Output() vcEmit: EventEmitter<VerifiableCredential> =
  new EventEmitter();

  isAlertOpenNotFound=false;
  isAlertExpirationOpenNotFound=false;
  isAlertOpenDeleteNotFound=false;

  isExpired: boolean = false;

  ngOnInit(): void {
    this.cred = this.credentialInput
    this.checkExpirationVC();
    }
    qrView(){
      if (!this.isExpired) {
        this.walletService.getVCinCBOR(this.cred).subscribe(
          (value: string) => {
            this.isAlertOpenNotFound = true;
            this.cred_cbor = value
          },
          (error: any) => {
            console.error(error); // Handle errors
          }
        );
      }
      else {
        this.isAlertExpirationOpenNotFound = true;
      }
    }
    isModalOpen = false;
    deleteView(){
      this.isModalDeleteOpen = true;
    }
    checkExpirationVC() {

          const expirationDate = new Date(this.cred.expirationDate);
          // Assuming each credential has an 'id' property
          const credentialId = this.cred.id;

          // Store the expiration date for the specific credential in localStorage
          localStorage.setItem(`vcExpirationDate_${credentialId}`, expirationDate.toISOString());

          const currentDate = new Date();
          if (expirationDate < currentDate) {
            this.isExpired = true;
          } 
          else {
          }
        }
    isModalDeleteOpen = false;
    deleteVC(){
      this.isModalDeleteOpen =true;

    }
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

    public deleteButtons = [{text: 'Cancel·la',
      role: 'cancel',
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
    setOpenExpirationNotFound(isOpen: boolean) {
      this.isAlertExpirationOpenNotFound = isOpen;
      }
    }
