import { CameraLog } from 'src/app/interfaces/camera-log';
import { CameraLogsService } from '../../../services/camera-logs.service';
import { Component, inject, OnInit, Signal, signal } from '@angular/core';
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

  private cameraLogs = this.cameraLogsService.cameraLogs$;

  get cameraLogs$(): Signal<CameraLog[] | undefined>{
    return this.cameraLogs;
  }

  constructor() { }

  async ngOnInit() {
    //TODO remove addCamera (dummy)
    // const dummyError = new Error('DummyError added from View-camer-logs.page');
    // await this.cameraLogsService.addCameraLog(dummyError, 'error');
    // await this.cameraLogsService.addCameraLog(new Error('DummyError2 added from View-camer-logs.page'), 'error');
    // await this.cameraLogsService.addCameraLog(new Error('DummyError3 added from View-camer-logs.page'), 'error');

    this.cameraLogsService.fetchCameraLogs();
  }

}
