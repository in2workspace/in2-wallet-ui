import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router,RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,RouterModule,TranslateModule]
})
export class SettingsPage implements OnInit {

  constructor(    private authenticationService: AuthenticationService,
    private router:Router
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
}
