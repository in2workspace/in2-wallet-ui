import { Component } from "@angular/core";
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router,RouterModule } from '@angular/router';
import { IonicModule, PopoverController } from '@ionic/angular';
import { CommonModule } from '@angular/common';


@Component ({
    selector: 'app.logout',
    templateUrl: './logout.page.html',
    standalone: true,
    imports: [IonicModule, CommonModule, RouterModule]
})
export class LogoutPage {
    constructor(private popOverController: PopoverController,
        private authenticationService: AuthenticationService,
        private router:Router) {}
    logout () {
        this.authenticationService.logout().subscribe(()=>{
            this.router.navigate(['/login'], {})
      
          });
        this.popOverController.dismiss();
    }
}


