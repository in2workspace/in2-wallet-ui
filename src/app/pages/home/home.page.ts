import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BarcodeScannerComponent } from 'src/app/components/barcode-scanner/barcode-scanner.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,BarcodeScannerComponent],

})
export class HomePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
