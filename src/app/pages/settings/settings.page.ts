import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router,RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PopoverController } from '@ionic/angular';
import {LogoutPage } from '../logout/logout.page';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,RouterModule,TranslateModule]
})
export class SettingsPage implements OnInit {

  constructor(    private authenticationService: AuthenticationService,
    private router:Router,
    private popoverController: PopoverController
    ) { }
  userName: string = '';

  ngOnInit() {
    this.userName = this.authenticationService.getName();

  }
  logout(){
    this.authenticationService.logout().subscribe(()=>{
      this.router.navigate(['/login'], {})

    });
  }
  async openPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: LogoutPage, 
      event: ev,
      translucent: true,
      cssClass: 'custom-popover'
    });
  
    await popover.present();
  }
}
