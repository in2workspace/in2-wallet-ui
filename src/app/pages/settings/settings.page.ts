import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule, TranslateModule]
})
export class SettingsPage implements OnInit {

  constructor(
    private router: Router,
    private dataService: DataService,

  ) { }
  userName: string = '';
  isAlertOpen: boolean = false;

  ngOnInit() {

  }
  goHomeWithEBSI() {
    this.dataService.getDid().subscribe({
      next: () => {
      this.router.navigate(['/tabs/credentials']);
    },
     error: (error) => {
        this.isAlertOpen = true;
        console.error(error)
      }
    })
  }
  toggleAlert() {
    this.isAlertOpen = !this.isAlertOpen;
  }
}
