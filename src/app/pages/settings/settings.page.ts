import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DataService } from 'src/app/services/data.service';
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
    private cameraLogsService: CameraLogsService,
    private translate: TranslateService
  ) {
  }

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

  public async sendCameraLogs() {
    this.translate.get('mailto_permission_alert').subscribe(async (translatedMsg: string) => {
      try {
        alert(translatedMsg)
        await this.cameraLogsService.fetchCameraLogs();
        this.cameraLogsService.sendCameraLogs();
      } catch (error) {
        console.error('Error sending camera logs:', error);
      }
  });
}
}
