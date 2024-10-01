import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DataService } from 'src/app/services/data.service';
import { CameraService } from 'src/app/services/camera.service';
import { CameraLogsService } from 'src/app/services/camera-logs.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule,
    TranslateModule,
  ],
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class SettingsPage {
  public userName = '';
  public isAlertOpen = false;

  public constructor(
    private router: Router,
    private dataService: DataService,
    private cameraLogsService: CameraLogsService
  ) {}

  public goHomeWithEBSI() {
    this.dataService.getDid().subscribe({
      next: () => {
        this.router.navigate(['/tabs/credentials']);
      },
      error: (error) => {
        this.isAlertOpen = true;
        console.error(error);
      },
    });
  }
  public toggleAlert() {
    this.isAlertOpen = !this.isAlertOpen;
  }
  public sendCameraLogs(){
    this.cameraLogsService.sendCameraLogs();
  }
}
