import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from "@angular/platform-browser";

import { BarcodeScannerLivestreamModule } from "ngx-barcode-scanner";
import { BarcodeScannerComponent } from './barcode-scanner.component';


@NgModule({
  declarations: [BarcodeScannerComponent],
  imports: [
    CommonModule,BrowserModule, BarcodeScannerLivestreamModule
  ]
})
export class BarcodeScannerModule { }
