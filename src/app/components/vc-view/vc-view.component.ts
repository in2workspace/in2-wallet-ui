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
import { CredentialTypeMap } from 'src/app/interfaces/credential-type-map';


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

  credentialType!: string;

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
  private readonly walletService = inject(WalletService);

  public isDetailModalOpen = false;

  public openDetailModal(): void {
    this.isDetailModalOpen = true;
  }

  public closeDetailModal(): void {
    this.isDetailModalOpen = false;
  }

  public ngOnInit(): void {
    this.checkExpirationVC();
    this.checkAvailableFormats();
    console.log(this.credentialInput);
    this.credentialType = this.getSpecificType(this.credentialInput);
  }

  public getSpecificType(vc: VerifiableCredential): string {
    const [a, b] = vc.type ?? [];
    if (a === 'VerifiableCredential') {
      return b;
    } else if (b === 'VerifiableCredential') {
      return a;
    } else {
      return 'VerifiableCredential';
    }
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
      } else if (action === 'detail') {
        this.openDetailModal();
      }
      event.preventDefault();
    }
  }

  get typeConfig() {
    return CredentialTypeMap[this.credentialType];
  }

  get iconUrl(): string | undefined {
    return this.typeConfig?.icon;
  }

  get mappedFields(): { label: string; value: string }[] {
    const subject = this.credentialInput.credentialSubject;
    return this.typeConfig?.fields.map(f => ({
      label: f.label,
      value: f.valueGetter(subject),
    })) ?? [];
  }

  public flattenObject(obj: any,parentKey: string = '',result: { label: string; value: string }[] = []): { label: string; value: string }[] {
    for (const key of Object.keys(obj)) {
      const value = obj[key];
      const label = parentKey ? `${parentKey} ${this.toLabel(key)}` : this.toLabel(key);

      if (Array.isArray(value)) {
        if (value.every(v => typeof v === 'object')) {
          value.forEach((v, i) => this.flattenObject(v, `${label} [${i}]`, result));
        } else {
          result.push({ label, value: value.join(', ') });
        }
      } else if (typeof value === 'object' && value !== null) {
        this.flattenObject(value, label, result);
      } else {
        result.push({ label, value: String(value) });
      }
    }
    return result;
  }

  private toLabel(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  }

  public getStructuredFields(): {
    section: string;
    fields: { label: string; value: string }[];
  }[] {
    const cs = this.credentialInput.credentialSubject as any;

    return [
      {
        section: 'Credential Info',
        fields: [
          { label: 'Id', value: this.credentialInput.id },
          { label: 'Type', value: this.credentialInput.type?.join(', ') ?? '' },
          { label: 'Status', value: this.credentialInput.status },
          {
            label: 'Available Formats',
            value: this.credentialInput.available_formats?.join(', ') ?? '',
          },
          { label: 'Valid Until', value: this.credentialInput.validUntil },
        ],
      },
      {
        section: 'Mandatee',
        fields: [
          { label: 'First Name', value: cs.mandate?.mandatee?.firstName ?? '' },
          { label: 'Last Name', value: cs.mandate?.mandatee?.lastName ?? '' },
          { label: 'Email', value: cs.mandate?.mandatee?.email ?? '' },
          { label: 'Nationality', value: cs.mandate?.mandatee?.nationality ?? '' },
          { label: 'Domain', value: cs.mandate?.mandatee?.domain ?? '' },
          { label: 'IP Address', value: cs.mandate?.mandatee?.ipAddress ?? '' },
        ],
      },
      {
        section: 'Mandator',
        fields: [
          { label: 'Organization', value: cs.mandate?.mandator?.organization ?? '' },
          { label: 'Common Name', value: cs.mandate?.mandator?.commonName ?? '' },
          { label: 'Serial Number', value: cs.mandate?.mandator?.serialNumber ?? '' },
          { label: 'Country', value: cs.mandate?.mandator?.country ?? '' },
          { label: 'Email Address', value: cs.mandate?.mandator?.emailAddress ?? '' },
          { label: 'Identifier', value: cs.mandate?.mandator?.organizationIdentifier ?? '' },
        ],
      },
      {
        section: 'Powers',
        fields: (cs.mandate?.power ?? []).flatMap((p: any, i: number) => [
          { label: `Power ${i + 1} ID`, value: p.id },
          { label: `Function`, value: p.function },
          { label: `Domain`, value: p.domain },
          { label: `Type`, value: p.type },
          { label: `Action`, value: Array.isArray(p.action) ? p.action.join(', ') : p.action },
        ]),
      },
    ];
  }


}