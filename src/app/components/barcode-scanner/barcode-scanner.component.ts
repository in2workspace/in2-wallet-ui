import { CommonModule } from "@angular/common";
import { Component, ViewChild, AfterViewInit, OnInit } from "@angular/core";
import { BarcodeScannerLivestreamComponent, BarcodeScannerLivestreamModule } from "ngx-barcode-scanner";

@Component({
  selector: 'app-barcode-scanner',
  templateUrl: './barcode-scanner.component.html',
  styleUrls: ['./barcode-scanner.component.scss'],
  standalone:true,
  imports:[CommonModule,BarcodeScannerLivestreamModule]
})
export class BarcodeScannerComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}
  @ViewChild(BarcodeScannerLivestreamComponent)
  barcodeScanner!: BarcodeScannerLivestreamComponent;

  barcodeValue: any;

  ngAfterViewInit() {
    this.barcodeScanner.start();
  }

  onValueChanges(result: { codeResult: { code: any; }; }) {
    this.barcodeValue = result.codeResult.code;
  }

  onStarted(started: any) {
    console.log(started);
  }
}
