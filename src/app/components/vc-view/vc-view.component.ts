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
import { CredentialDetailMap, EvaluatedSection } from 'src/app/interfaces/credential-detail-map';
import * as dayjs from 'dayjs';
import { ToastServiceHandler } from 'src/app/services/toast.service';


@Component({
  selector: 'app-vc-view',
  templateUrl: './vc-view.component.html',
  styleUrls: ['./vc-view.component.scss'],
  standalone: true,
  imports: [IonicModule, QRCodeModule, TranslateModule, CommonModule],
})
export class VcViewComponent implements OnInit {
  @Input() public credential!: VerifiableCredential;
  public credentialInput: VerifiableCredential = 
  {
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://www.dome-marketplace.eu/.well-know/credentials/learcredentialmachine/v2"
    ],
    "id": "urn:uuid:68422e47-5d69-4e0b-8a49-34990f2f76a2",
    "type": ["VerifiableCredential", "LEARCredentialMachine"],
    "name": "Agent Machine Credential",
    "description": "Machine credential acting as an authorized agent on behalf of a legal entity",
    "issuer": {
      "id": "did:elsi:VATES-A12345678",
      "organization": "TRUST SERVICES, S.L.",
      "country": "ES",
      "commonName": "TRUST SERVICE ELECTRONIC SEAL FOR VERIFIABLE CREDENTIALS",
      "serialNumber": "610dde5a0000000003"
    },
    "validFrom": "2025-04-17T14:30:00.000000000Z",
    "validUntil": "2026-04-17T14:30:00.000000000Z",
    "credentialSubject": {
      "mandate": {
        "id": "urn:uuid:a2ece539-e199-4be9-a781-3a11f4a25ad9",
        "mandator": {
          "id": "did:elsi:VATFR-B12345678",
          "organization": "GOOD AIR, S.L.",
          "country": "FR",
          "commonName": "JEAN MARTIN - CNI 880692310285",
          "serialNumber": "880692310285"
        },
        "mandatee": {
          "id": "did:key:zDnaexS1hEocz1R51ZXakcUPXWZSzkVEBJAEz9fHtxjfqZRhN",
          "domain": "dpas.goodair.fr",
          "ipAddress": "195.70.63.244"
        },
        "power": [
          {
            "id": "eb02efa8-193d-43a2-8ddd-3a124c6aee83",
            "type": "domain",
            "domain": "DOME",
            "function": "Onboarding",
            "action": ["execute"]
          }
        ]
      }
    },
    credentialStatus: CredentialStatus.VALID,
    status: CredentialStatus.VALID
  }
  @Input() public isDetailViewActive = false;
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
  public showToken = false;
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
  private readonly toastService = inject(ToastServiceHandler);

  public isDetailModalOpen = false;
  public evaluatedSections!: EvaluatedSection[];

  public openDetailModal(): void {
    if(this.isDetailViewActive){
      this.isDetailModalOpen = true;
      this.getStructuredFields();
    }
  }

  public closeDetailModal(): void {
    this.isDetailModalOpen = false;
  }

  public ngOnInit(): void {
    this.checkExpirationVC();
    this.checkAvailableFormats();
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

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.toastService.showToast('vc-fields.copy-success');
    }).catch(err => {
      console.error('Error al copiar', err);
    });
  }

  // TO DO: funcion antigua, revisar si se puede eliminar
  public checkAvailableFormats(): void {
    /*this.showChip =
      this.credentialInput.available_formats?.includes('cwt_vc') ?? false;*/
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
    this.isDetailModalOpen = false;
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

  public getStructuredFields(): void {
    const cs = this.credentialInput.credentialSubject;
    const vc = this.credentialInput;

    const credentialInfo: EvaluatedSection = {
      section: 'vc-fields.title',
      fields: [
        { label: 'vc-fields.credentialInfo.context', value: Array.isArray(vc['@context']) ? vc['@context'].join(', ') : (vc['@context'] ?? '') },
        { label: 'vc-fields.credentialInfo.id', value: vc.id },
        { label: 'vc-fields.credentialInfo.type', value: Array.isArray(vc.type) ? vc.type.join(', ') : (vc.type ?? '') },
        { label: 'vc-fields.credentialInfo.name', value: vc.name ?? '' },
        { label: 'vc-fields.credentialInfo.description', value: vc.description ?? '' },
        { label: 'vc-fields.credentialInfo.issuerId', value: vc.issuer.id },
        { label: 'vc-fields.credentialInfo.issuerOrganization', value: vc.issuer.organization ?? '' },
        { label: 'vc-fields.credentialInfo.issuerCountry', value: vc.issuer.country ?? '' },
        { label: 'vc-fields.credentialInfo.issuerCommonName', value: vc.issuer.commonName ?? '' },
        { label: 'vc-fields.credentialInfo.issuerSerialNumber', value: vc.issuer?.serialNumber ?? '' },
        { label: 'vc-fields.credentialInfo.validFrom', value: this.formatDate(vc.validFrom) },
        { label: 'vc-fields.credentialInfo.validUntil', value: this.formatDate(vc.validUntil) }
      ].filter(field => !!field.value && field.value !== ''),
    };

    const entry = CredentialDetailMap[this.credentialType];
    const detailedSections: EvaluatedSection[] = typeof entry === 'function'
      ? entry(cs, vc).map(section => ({
          section: section.section,
          fields: section.fields
            .map(f => ({
              label: f.label,
              value: f.valueGetter(cs, vc),
            }))
            .filter(f => !!f.value && f.value !== ''),
        }))
      : (entry ?? []).map(section => ({
          section: section.section,
          fields: section.fields
            .map(f => ({
              label: f.label,
              value: f.valueGetter(cs, vc),
            }))
            .filter(f => !!f.value && f.value !== ''),
        }));


    this.evaluatedSections = [credentialInfo, ...detailedSections].filter(section => section.fields.length > 0);
  }

  private formatDate(date: string | undefined): string {
    if (!date) {
      return ''; 
    }
    return dayjs(date).format('DD/MM/YYYY');
  }


}