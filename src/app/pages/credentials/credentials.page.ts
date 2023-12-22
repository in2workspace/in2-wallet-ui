import {Component, inject, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {StorageService} from 'src/app/services/storage.service';
import {QRCodeModule} from 'angular2-qrcode';
import {WalletService} from 'src/app/services/wallet.service';
import {VcViewComponent, VerifiableCredential} from "../../components/vc-view/vc-view.component";
import {TranslateModule} from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-credentials',
  templateUrl: './credentials.page.html',
  standalone: true,
  providers: [StorageService],
  imports: [IonicModule, CommonModule, FormsModule, QRCodeModule, VcViewComponent, TranslateModule]
})
export class CredentialsPage implements OnInit {
  userName: string = '';

  credList: Array<VerifiableCredential> = [];
  size: number = 300;
  credDataList: any[] = [];
  @Input() availableDevices: MediaDeviceInfo[] = [];
  currentDevice: any;
  private walletService = inject(WalletService);
  private router = inject(Router);
  private authenticationService = inject(AuthenticationService)

  ngOnInit() {
    this.userName = this.authenticationService.getName();

    this.refresh()
  }
  scan(){
    this.router.navigate(['/tabs/home/'], {
      queryParams: { toggle: true },
    });
  }
  refresh() {
    this.walletService.getAllVCs().subscribe((credentialListResponse: Array<VerifiableCredential>) => {
      this.credList = credentialListResponse;
    })
  }

  vcDelete(cred: VerifiableCredential) {
    this.walletService.deleteVC(cred.id).subscribe((response: any) => {
      console.log(response)
      this.refresh()
    })
  }

}
