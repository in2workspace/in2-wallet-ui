import {Component, inject, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule, PopoverController} from '@ionic/angular';
import {StorageService} from 'src/app/services/storage.service';
import {QRCodeModule} from 'angular2-qrcode';
import {WalletService} from 'src/app/services/wallet.service';
import {VcViewComponent, VerifiableCredential} from "../../components/vc-view/vc-view.component";
import {TranslateModule} from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import {LogoutPage } from '../logout/logout.page';

const TIME_IN_MS = 10000;

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
  private route = inject(ActivatedRoute);
  private authenticationService = inject(AuthenticationService);
  private popoverController= inject(PopoverController);
  isAlertOpen = false;

  ngOnInit() {
    this.userName = this.authenticationService.getName();
    this.walletService.getAllVCs().subscribe((credentialListResponse: Array<VerifiableCredential>) => {
      this.credList = credentialListResponse.reverse();
      console.log(this.credList);
      this.route.queryParams.subscribe((params) => {
        this.isAlertOpen = params['alertOpen'];
        setTimeout(() => {
          this.refresh();
          this.isAlertOpen = false;
        }, TIME_IN_MS);
      })
    }) 
    //this.refresh();
  }
  scan(){
    this.router.navigate(['/tabs/home/'], {
      queryParams: { toggleScan: true, from: 'credential', show_qr: true },
    });
  }

  logout(){
    this.authenticationService.logout().subscribe(()=>{
      this.router.navigate(['/login'], {})

    });
  }

  async openPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: LogoutPage, 
      event: ev,
      translucent: true,
      cssClass: 'custom-popover'
    });
  
    await popover.present();
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
