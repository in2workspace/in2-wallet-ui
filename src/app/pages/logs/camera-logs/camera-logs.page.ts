import { CameraLog } from 'src/app/interfaces/camera-log';
import { CameraLogsService } from '../../../services/camera-logs.service';
import { Component, inject, OnInit } from '@angular/core';
import { IonicModule, InfiniteScrollCustomEvent  } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-view-logs',
  templateUrl: './camera-logs.page.html',
  styleUrls: ['./camera-logs.page.scss'],
  standalone: true,
  imports:[ IonicModule, DatePipe, TranslateModule]
})
export class CameraLogsPage implements OnInit {
  private readonly cameraLogsService = inject(CameraLogsService);

  public cameraLogs: CameraLog[] = [];
  public displayedLogs: CameraLog[] = [];
  private readonly logsBatchSize = 10;
  public scrollThreshold = '20%';
  private currentIndex = 0;


  async ngOnInit() {
    const logs = await this.cameraLogsService.getCameraLogs();
    this.cameraLogs = logs;
    this.loadLogs('INITIAL');
  }

  loadLogs(event: InfiniteScrollCustomEvent|'INITIAL') {
    const nextIndex = this.currentIndex + this.logsBatchSize;
    const newLogs = this.cameraLogs.slice(this.currentIndex, nextIndex);
    this.displayedLogs = [...this.displayedLogs, ...newLogs];
    this.currentIndex = nextIndex;

    if(event!=='INITIAL' && event?.target){
      event.target.complete();

      if (this.displayedLogs.length >= this.cameraLogs.length) {
        event.target.disabled = true;
      }
    }
  }

}
