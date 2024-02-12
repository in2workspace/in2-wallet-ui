import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, PopoverController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {LogoutPage } from '../logout/logout.page';
import { DataService } from 'src/app/services/data.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule, TranslateModule]
})
export class SettingsPage implements OnInit {

  constructor(private authenticationService: AuthenticationService,
    private router: Router,
    private dataService: DataService,
    private http: HttpClient,
    private popoverController: PopoverController

  ) { }
  userName: string = '';
  isAlertOpen: boolean = false;

  ngOnInit() {
    this.userName = this.authenticationService.getName();

  }
  goHomeWithEBSI() {
    this.dataService.getDid().subscribe((did) => {
      this.dataService.sendDid(did);
      this.router.navigate(['/tabs/credentials']);
    },
      (error) => {
        this.isAlertOpen = true;
      })
  }
  toggleAlert() {
    this.isAlertOpen = !this.isAlertOpen;
  }
  logout() {
    console.log("hola")
    this.authenticationService.logout().subscribe(() => {
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
