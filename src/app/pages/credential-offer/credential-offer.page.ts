import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { WalletService } from 'src/app/services/wallet.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { StorageService } from 'src/app/services/storage.service';
import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-credential-offer',
  templateUrl: './credential-offer.page.html',
  styleUrls: ['./credential-offer.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule,RouterModule]
})
export class CredentialOfferPage implements OnInit {

  constructor(    private walletService: WalletService
    ) { }
  issuersList = [];
  didsList =[]
  login = new FormGroup<any>({
    issuerName: new FormControl('', {nonNullable: true}),
    did: new FormControl('', {nonNullable: true}),
});
  ngOnInit() {
    this.walletService.getAllDIDs().subscribe(response => {console.log(response);this.didsList=response})
    this.walletService.getAllIssuers().subscribe(response => {console.log(response);this.issuersList=response})

  }
  isAlertOpen = false;

  onSubmit(){
    this.walletService.submitCredential(this.login.value).subscribe(response => {
      this.isAlertOpen = true;

      console.log(response);})
  }
  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }
  newDid(){
    this.walletService.postDid({"type":"key","value":null}).subscribe(response => {
      this.walletService.getAllDIDs().subscribe(response => {console.log(response);this.didsList=response})

      console.log(response);})  }
}
