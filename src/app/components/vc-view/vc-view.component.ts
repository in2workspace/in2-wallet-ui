import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { QRCodeModule } from 'angularx-qrcode';
import { WalletService } from 'src/app/services/wallet.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CredentialStatus, VerifiableCredential } from 'src/app/interfaces/verifiable-credential';

@Component({
  selector: 'app-vc-view',
  templateUrl: './vc-view.component.html',
  standalone: true,
  imports: [IonicModule, QRCodeModule, TranslateModule, CommonModule],
})
export class VcViewComponent implements OnInit {
  @Input() public credentialInput!: VerifiableCredential;
  @Output() public vcEmit: EventEmitter<VerifiableCredential> = new EventEmitter();

  public cred_cbor = '';
  public isAlertOpenNotFound = false;
  public isAlertExpirationOpenNotFound = false;
  public isAlertOpenDeleteNotFound = false;
  public isExpired = false;
  public isModalOpen = false;
  public isModalDeleteOpen = false;
  public showChip = true;

  public handlerMessage = '';
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
      text: 'Cancel·la',
      role: 'cancel',
      handler: () => {
        this.isModalDeleteOpen = false;
      },
    },
    {
      text: 'Sí, elimina-la',
      role: 'confirm',
      handler: () => {
        this.isModalDeleteOpen = true;
        this.vcEmit.emit(this.credentialInput);
      },
    },
  ];

  private walletService = inject(WalletService);

  public ngOnInit(): void {
    this.checkExpirationVC();
    this.checkAvailableFormats();
    this.isCredentialGenerated();
  }
  public checkAvailableFormats() {
    if (this.credentialInput && this.credentialInput.available_formats) {
      this.showChip = this.credentialInput.available_formats.includes('cwt_vc');
    }
  }
  public qrView() {
    if (!this.isExpired) {
      this.walletService.getVCinCBOR(this.credentialInput).subscribe({
        next: (value: string) => {
          this.isAlertOpenNotFound = true;
          this.cred_cbor = value;
        },
        error: (error: unknown) => {
          console.error(error);
        },
      });
    } else {
      this.isAlertExpirationOpenNotFound = true;
    }
  }
  public deleteVC() {
    this.isModalDeleteOpen = true;
  }
  public setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }
  public deleteView() {
    this.isModalDeleteOpen = true;
  }

  public checkExpirationVC() {
    const expirationDate = new Date(this.credentialInput.expirationDate);
    const credentialId = this.credentialInput.id;

    localStorage.setItem(
      `vcExpirationDate_${credentialId}`,
      expirationDate.toISOString()
    );

    const currentDate = new Date();
    if (expirationDate < currentDate) {
      this.isExpired = true;
    }
  }

  public setOpenNotFound(isOpen: boolean) {
    this.isAlertOpenNotFound = isOpen;
  }
  public setOpenDeleteNotFound(isOpen: boolean) {
    this.isAlertOpenDeleteNotFound = isOpen;
  }
  public setOpenExpirationNotFound(isOpen: boolean) {
    this.isAlertExpirationOpenNotFound = isOpen;
  }

  public isCredentialGenerated(): boolean {
    return this.credentialInput?.status === CredentialStatus.ISSUED;
  }

  public retrieveCredential(): void {
    if (this.isCredentialGenerated() && !this.isExpired) {
      this.walletService.requestSignature(this.credentialInput).subscribe({
        next: (response) => {
          console.log('Signature requested successfully', response);
        },
        error: (error) => {
          console.error('There was an error requesting the signature', error);
        }
      });
    }
  }

}
