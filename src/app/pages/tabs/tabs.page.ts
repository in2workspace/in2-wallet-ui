import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TranslateModule,
    RouterModule,
  ],
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class TabsPage {
  public constructor() {}
}
