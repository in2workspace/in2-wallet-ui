import { inject, Injectable, Signal, signal } from '@angular/core';
import { CameraLog } from '../interfaces/camera-log';
import { HttpClient } from '@angular/common/http';
import { distinctUntilChanged, Observable, tap } from 'rxjs';
import { StorageService } from './storage.service';

export const dummyCameraLogs:CameraLog[] = [
  {
  id:'1',
  message:'log 1',
  date: new Date()
  },
  {
  id:'2',
  message:'log 2',
  date: new Date()
  },
];

@Injectable({
  providedIn: 'root'
})
export class CameraLogsService {
  private http = inject(HttpClient);
  private storageService = inject(StorageService);

  private cameraLogs = signal<CameraLog[]|undefined>([]);

  get cameraLogs$(): Signal<CameraLog[]|undefined>{
    return this.cameraLogs.asReadonly();
  }

  public setCameraLogs(logs: CameraLog[]|undefined): void{
    const newLogs = logs !== undefined ? [...logs] : undefined;
    this.cameraLogs.set(newLogs);
  }

  public async addCameraLog(log: Error|undefined):Promise<void> {
    // Setup Log object
    let message='undefined error';
    if(log?.message){
      message=log.message;
    }

    //store Log object and update
      if(this.cameraLogs$){ //TODO remove dummies
        await this.storageService.set('CAMERA_LOGS', dummyCameraLogs[0]);
        this.cameraLogs.set([...this.cameraLogs$()!, dummyCameraLogs[0]]);
        await this.storageService.set('CAMERA_LOGS', dummyCameraLogs[1]);
        this.cameraLogs.set([...this.cameraLogs$()!, dummyCameraLogs[1]]);

        await this.storageService.set('CAMERA_LOGS', log);
      }
  }

  public async fetchCameraLogs():Promise<void> {
    const items = await this.storageService.getAll();
    const cameraLogs = items;
  }

   //TODO
   public sendCameraLogs(): Observable<CameraLog[]|undefined>{
    console.log("sendCameraLogs function executed");
    alert("Send camera logs executed (pending implementation)");
    return this.http.post<CameraLog[]|undefined>('', {});
  }

  constructor() {
  }

}
