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
    username: new FormControl('', {nonNullable: true}),
    password: new FormControl('', {nonNullable: true}),
});
  ngOnInit() {
    this.walletService.getAllDIDs().subscribe(response => {console.log(response);this.didsList=response})

  }
  onSubmit(){
  }
}
