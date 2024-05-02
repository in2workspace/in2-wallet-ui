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
import { HttpErrorResponse } from '@angular/common/http';
import { ToastServiceHandler } from 'src/app/services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vc-view',
  templateUrl: './vc-view.component.html',
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
  public showChip = true;
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
  public constructor(private toastServiceHandler: ToastServiceHandler,  private router: Router) {}

  public ngOnInit(): void {
    this.credentialInput.status;
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

  public setOpen(isOpen: boolean): void {
    this.isModalOpen = isOpen;
  }

  public checkExpirationVC(): void {
    if (this.credentialInput.status !== CredentialStatus.ISSUED) {
      const expirationDate: Date = new Date(
        this.credentialInput.expirationDate
      );
      const currentDate: Date = new Date();
      this.isExpired = expirationDate < currentDate;
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
      this.credentialInput.status === CredentialStatus.ISSUED && !this.isExpired
    );
  }

  public requestSignature(): void {
    console.log('Credential requested');
    if (this.credentialInput && this.credentialInput.id) {
      this.walletService.requestSignature(this.credentialInput.id).subscribe({
        next: (signedCredential: string) => {
          console.log('Credential signed:', signedCredential);
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([location.pathname]);
          });
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error requesting signature:', error.message);

          setTimeout(() => {
            this.toastServiceHandler.showErrorAlert('Unsigned').subscribe();
          }, 2000);
        }
      });
    }
  }
}
