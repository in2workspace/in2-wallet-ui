import { CameraLog } from 'src/app/interfaces/camera-log';
import { CameraLogsService } from '../../../services/camera-logs.service';
import { Component, inject, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-view-logs',
  templateUrl: './camera-logs.page.html',
  styleUrls: ['./camera-logs.page.scss'],
  standalone: true,
  imports:[ IonicModule, DatePipe]
})
export class CameraLogsPage implements OnInit {
  private cameraLogsService = inject(CameraLogsService);

  public cameraLogs:CameraLog[] = [];


  constructor() { 
  }

  async ngOnInit() {
    const logs = await this.cameraLogsService.getCameraLogs();
    this.cameraLogs = logs;
  }

}
