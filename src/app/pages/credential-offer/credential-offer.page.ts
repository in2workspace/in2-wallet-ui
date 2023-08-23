import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { WalletService } from 'src/app/services/wallet.service';

@Component({
  selector: 'app-credential-offer',
  templateUrl: './credential-offer.page.html',
  styleUrls: ['./credential-offer.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CredentialOfferPage implements OnInit {

  constructor(    private walletService: WalletService
    ) { }
  issuersList = [];
  didsList =[]
  ngOnInit() {
    this.walletService.getAllDIDs().subscribe(response => {console.log(response);this.didsList=response})

  }

}
