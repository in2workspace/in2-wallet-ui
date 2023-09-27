import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { QRCodeModule } from 'angular2-qrcode';
import { VCReply, WalletService } from 'src/app/services/wallet.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-vc-selector',
  templateUrl: './vc-selector.page.html',
  styleUrls: ['./vc-selector.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, QRCodeModule],
  providers: [StorageService],
})
export class VcSelectorPage implements OnInit {
  isClick: boolean[] = [];
  selCredList: any[] = [];
  credList: any[] = [];
  credDataList: any[] = [];
  tamano: number = 300;
  executionResponse: any;
  _VCReply: VCReply = {
    selectedVcList:[],
    state:"",
    redirectUri:""  
  };
  constructor(
    private router: Router,
    private storageService: StorageService,
    private walletService: WalletService,
    private route: ActivatedRoute
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
  sendCred() {
    this._VCReply.selectedVcList=this.selCredList;
    this.walletService
      .executeVC(this._VCReply)
      .subscribe({
        next: (authenticationResponse) => {
          this.isAlertOpen = true;
          this.isAlertOpen = true;
          let TIME_IN_MS = 1500;
          setTimeout(() => {
            this.isAlertOpen = false;
          }, TIME_IN_MS);
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 2000);
        },
        error : (err) => {
          let TIME_IN_MS = 1500;
          setTimeout(() => {
            this.isAlertOpenFail = false;
          }, TIME_IN_MS);
          this.isAlertOpenFail = true;
        }
      });
  }
  isAlertOpenFail = false;

  isAlertOpen = false;
  public alertButtons = ['OK'];

  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }
}
