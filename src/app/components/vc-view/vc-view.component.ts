import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { QRCodeModule } from 'angularx-qrcode';
import { WalletService } from 'src/app/services/wallet.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  CredentialStatus,
  VerifiableCredential,
} from 'src/app/interfaces/verifiable-credential';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-vc-view',
  templateUrl: './vc-view.component.html',
  styleUrls: ['./vc-view.component.scss'],
  standalone: true,
  imports: [IonicModule, QRCodeModule, TranslateModule, CommonModule],
})
export class VcViewComponent implements OnInit {
  @Input() public credentialInput!: VerifiableCredential;
  @Output() public vcEmit: EventEmitter<VerifiableCredential> =
    new EventEmitter();

  public cred_cbor = '';
  public isAlertOpenNotFound = false;
  public isAlertExpirationOpenNotFound = false;
  public isAlertOpenDeleteNotFound = false;
  public isExpired = false;
  public isModalOpen = false;
  public isModalDeleteOpen = false;
  public isModalUnsignedOpen = false;
  public showChip = false;
  public credentialStatus = CredentialStatus;
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
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        this.isModalDeleteOpen = false;
      },
    },
    {
      text: 'Yes, delete it',
      role: 'confirm',
      handler: () => {
        this.isModalDeleteOpen = true;
        this.vcEmit.emit(this.credentialInput);
      },
    },
  ];

  public unsignedButtons = [{
    text: 'Close',
    role: 'close',
    handler: () => {
      this.isModalUnsignedOpen = false;
    },
  },
  ];
  private walletService = inject(WalletService);

  public ngOnInit(): void {
    this.checkExpirationVC();
    this.checkAvailableFormats();
  }

  public checkAvailableFormats(): void {
    this.showChip =
      this.credentialInput.available_formats?.includes('cwt_vc') ?? false;
  }

  public qrView(): void {
    if (!this.isExpired) {
      this.walletService.getVCinCBOR(this.credentialInput).subscribe({
        next: (value: string) => {
          this.cred_cbor = value;
          this.isAlertOpenNotFound = false;
        },
        error: (error: unknown) => {
          console.error('Error fetching VC in CBOR format:', error);
          this.isAlertOpenNotFound = true;
        },
      });
    } else {
      this.isAlertExpirationOpenNotFound = true;
    }
  }

  public deleteVC(): void {
    this.isModalDeleteOpen = true;
  }

  public unsignedInfo(): void {
    this.isModalUnsignedOpen = true;
  }

  public setOpen(isOpen: boolean): void {
    this.isModalOpen = isOpen;
  }

  public checkExpirationVC(): void {
    if (this.credentialInput.status !== CredentialStatus.ISSUED) {
      const validUntil: Date = new Date(
        this.credentialInput.validUntil
      );
      const currentDate: Date = new Date();
      this.isExpired = validUntil < currentDate;
    } else {
      this.isExpired = false;
    }
  }

  public setOpenNotFound(isOpen: boolean): void {
    this.isAlertOpenNotFound = isOpen;
  }

  public setOpenDeleteNotFound(isOpen: boolean): void {
    this.isAlertOpenDeleteNotFound = isOpen;
  }

  public setOpenExpirationNotFound(isOpen: boolean): void {
    this.isAlertExpirationOpenNotFound = isOpen;
  }

  public isCredentialIssuedAndNotExpired(): boolean {
    return (
      this.credentialInput.status === CredentialStatus.ISSUED
      && !this.isExpired
    );
  }

  public handleKeydown(event: KeyboardEvent, action = 'request') {
    if (event.key === 'Enter' || event.key === ' ') {
      if (action === 'qr') {
        this.qrView();
      } 
      event.preventDefault();
    }
  }

  public handleButtonKeydown(event: KeyboardEvent, action: string): void {
    if (event.key === 'Enter' || event.key === ' ') {
      if (action === 'delete') {
        this.deleteVC();
      } else if (action === 'close') {
        this.setOpen(false);
      } else if (action === 'info') {
        this.unsignedInfo();
      }
      event.preventDefault();
    }
  }
}