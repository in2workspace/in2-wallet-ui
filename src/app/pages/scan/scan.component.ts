import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.scss'],
  standalone: true,
})
export class ScanComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

  ngOnDestroy(){
    console.log('destroy scan component')
  }

}
