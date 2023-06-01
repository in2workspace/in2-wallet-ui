import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { QRCodeModule } from 'angular2-qrcode';
import { WalletService } from 'src/app/services/wallet.service';
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
  selCredList: string[] = [];
  credList: string[] = [];
  credDataList: any[] = [];
  tamano: number = 300;
  executionResponse: any;
  siop_authentication_request: any;
  constructor(
    private router: Router,
    private storageService: StorageService,
    private walletService: WalletService,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((params) => {
      this.siop_authentication_request = JSON.parse(params['executionResponse'])[0];
      this.executionResponse = JSON.parse(params['executionResponse']);
      this.executionResponse.shift();
    });
  }

  ngOnInit() {
    this.credList = this.executionResponse;
    this.credList.forEach((credential) => {
      this.walletService.getOne(credential).subscribe((vc: any) => {
        console.log(vc);
        this.credDataList.push(vc['vc']['value']);
        this.isClick.push(false);
      });
    });
  }
  isClicked(index: number) {
    return this.isClick[index];
  }
  selectCred(cred: string, index: number) {
    this.selCredList.push(cred);
    this.isClick[index] = !this.isClick[index];
  }
  sendCred() {
    this.walletService
      .executeVC(this.selCredList, this.siop_authentication_request)
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
