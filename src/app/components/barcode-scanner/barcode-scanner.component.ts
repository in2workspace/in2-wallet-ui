import { CommonModule } from "@angular/common";
import { Component, ViewChild, AfterViewInit, OnInit } from "@angular/core";

@Component({
  selector: 'app-barcode-scanner',
  templateUrl: './barcode-scanner.component.html',
  styleUrls: ['./barcode-scanner.component.scss'],
  standalone:true,
  imports:[CommonModule]
})
export class BarcodeScannerComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}
 
}
