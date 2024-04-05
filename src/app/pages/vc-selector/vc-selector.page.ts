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
export class VcSelectorPage implements OnInit {
  isClick: boolean[] = [];
  selCredList: any[] = [];
  credList: any[] = [];
  credDataList: any[] = [];
  size: number = 300;
  executionResponse: any;
  userName: string = '';

  _VCReply: VCReply = {
    selectedVcList: [],
    state: '',
    redirectUri: '',
  };
  constructor(
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
    });
  }

  ngOnInit() {
    this.credList = this.executionResponse['selectableVcList'];
    this.credList.forEach((credential) => {
      this.isClick.push(false);
    });
  }

  isClicked(index: number) {
    return this.isClick[index];
  }


  selectCred(cred: any, index: number) {
    this.selCredList.push(cred);
    this.isClick[index] = !this.isClick[index];
  }
  async sendCred(cred: any) {
    const alert = await this.alertController.create({
      header: this.translate.instant('confirmation.header'),
      buttons: [
        {
          text: this.translate.instant('confirmation.cancel'),
          role: 'cancel',
        },
        {
          text: this.translate.instant('confirmation.ok'),
          role:'ok',
        },
      ],
    });

    await alert.present();
    const result = await alert.onDidDismiss();
    console.log(result);

    if(result.role==='ok'){
    this.selCredList.push(cred);
    this._VCReply.selectedVcList = this.selCredList;
    this.walletService.executeVC(this._VCReply).subscribe({
      next: () => {
        this.isAlertOpen = true;
      },
      error: (err) => {
        console.error(err);
      },
      complete: () =>{
        this.selCredList = [];
      }
    });}
  }

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


  isAlertOpen = false;
  public alertButtons = ['OK'];

  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }
}
