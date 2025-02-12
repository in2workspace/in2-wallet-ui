import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.scss',
  standalone: true,
  imports:[
    IonicModule,
    RouterModule,
    TranslateModule
  ]
})
export class LogsComponent {

}
