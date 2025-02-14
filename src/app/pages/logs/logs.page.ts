import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-logs-page',
  templateUrl: './logs.page.html',
  standalone: true,
  imports:[
    RouterOutlet,
    IonicModule
  ]
})
export class LogsPage {

}
