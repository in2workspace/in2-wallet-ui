import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule } from '@ionic/angular';
import { QRCodeModule } from 'angularx-qrcode';
import { WalletService } from 'src/app/services/wallet.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { VcViewComponent } from '../../components/vc-view/vc-view.component';
import { VCReply } from 'src/app/interfaces/verifiable-credential-reply';
import { VerifiableCredential } from 'src/app/interfaces/verifiable-credential';

@Component({
  selector: 'app-vc-selector',
  templateUrl: './vc-selector.page.html',
  styleUrls: ['./vc-selector.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    QRCodeModule,
    TranslateModule,
    VcViewComponent,
  ],
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class VcSelectorPage implements OnInit {
  public isClick: boolean[] = [];
  public selCredList: VerifiableCredential[] = [];
  public credList: VerifiableCredential[] = [];
  public credDataList: VerifiableCredential[] = [];
  public size = 300;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public executionResponse: any;
  public userName = '';
  public isAlertOpen = false;
  public alertButtons = ['OK'];

  public _VCReply: VCReply = {
    selectedVcList: [],
    state: '',
    nonce: '',
    redirectUri: '',
  };

  public closeButton = [
    {
      text: this.translate.instant('vc-selector.close'),
      role: 'confirm',
      handler: () => {
        this.isAlertOpen = false;
        this.router.navigate(['/tabs/home']);
      },
    },
  ];

  public constructor(
    private router: Router,
    private walletService: WalletService,
    private route: ActivatedRoute,
    public translate: TranslateService,
    private alertController: AlertController
  ) {
    this.route.queryParams.subscribe((params) => {
      this.executionResponse = JSON.parse(params['executionResponse']);
      this._VCReply.redirectUri = this.executionResponse['redirectUri'];
      this._VCReply.state = this.executionResponse['state'];
      this._VCReply.nonce = this.executionResponse['nonce'];
    });
  }

  public ngOnInit() {
    this.credList = this.executionResponse['selectableVcList'];
    this.credList.forEach(() => {
      this.isClick.push(false);
    });
  }

  public isClicked(index: number) {
    return this.isClick[index];
  }

  public selectCred(cred: VerifiableCredential, index: number) {
    this.selCredList.push(cred);
    this.isClick[index] = !this.isClick[index];
  }
  public async sendCred(cred: VerifiableCredential) {
    const alert = await this.alertController.create({
      header: this.translate.instant('confirmation.header'),
      buttons: [
        {
          text: this.translate.instant('confirmation.cancel'),
          role: 'cancel',
        },
        {
          text: this.translate.instant('confirmation.ok'),
          role: 'ok',
        },
      ],
    });

    await alert.present();
    const result = await alert.onDidDismiss();
    console.log(result);

    if (result.role === 'ok') {
      this.selCredList.push(cred);
      this._VCReply.selectedVcList = this.selCredList;
      this.walletService.executeVC(this._VCReply).subscribe({
        next: () => {
          this.isAlertOpen = true;
        },
        error: (err) => {
          console.error(err);
        },
        complete: () => {
          this.selCredList = [];
        },
      });
    }
  }

  public setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }
}
