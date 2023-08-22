import {
  Component, EventEmitter, Input, OnInit, Output,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { QRCodeModule } from 'angular2-qrcode';

export interface VerifiableCredential{
  didSubject:{firstName:string,familyName:string,nom:string,cognoms:string},
  id:string,
  didType:['','']

}
@Component({
  selector: 'app-did-view',
  templateUrl: './did-view.component.html',
  standalone: true,
  imports: [IonicModule,QRCodeModule],
})
export class DidViewComponent implements OnInit{

  @Input() didInput: any = {did:""};
  did: any ={did:""};
  @Output() didEmit: EventEmitter<string> =
  new EventEmitter();

  ngOnInit(): void {
    console.log(this.didInput)
    this.did = this.didInput
    }
    deleteDid(){
      this.didEmit.emit(this.did);
    }
    }
