import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-logs-page',
  templateUrl: './logs.page.html',
  styleUrls: ['./logs.page.scss'],
  standalone: true,
  imports:[
    IonicModule,
    RouterModule,
    TranslateModule
  ]
})
export class LogsPage  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
