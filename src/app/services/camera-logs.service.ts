import { inject, Injectable, Signal, signal } from '@angular/core';
import { CameraLog, CameraLogType } from '../interfaces/camera-log';
import { HttpClient } from '@angular/common/http';
import { distinctUntilChanged, Observable, tap } from 'rxjs';
import { StorageService } from './storage.service';

export const LOGS_PREFIX = 'CAMERA_LOGS';

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

  public async addCameraLog(err: Error | undefined, exceptionType:CameraLogType): Promise<void> {
    let message = err?.message ?? 'undefined error';
    const log: CameraLog = {
      id:  (Math.floor(Math.random() * 900) + 100).toString(),
      type: exceptionType,
      message,
      stack:err?.stack ?? '',
      date: new Date()
    };
    console.log("New log to add: ");
    console.log(log);
    let currentLogs: CameraLog[] = [];
  
    const storedLogs = await this.storageService.get(LOGS_PREFIX);
    if (storedLogs) {
      try {
        currentLogs = JSON.parse(storedLogs);
      } catch (e) {
        console.error('Error parsing stored logs:', e);
      }
    }
    console.log("Parsed currentLogs from storage: ");
    console.log(currentLogs);
    if (log) {
      currentLogs.push(log);
    }
  
    await this.storageService.set('CAMERA_LOGS', JSON.stringify(currentLogs));
    this.fetchCameraLogs(); //TODO potser simplement setCameraLog per evitar fer tot el fetch?
  }

  public async fetchCameraLogs(): Promise<void> {
    console.log("fetching logs...");
    const storedLogs = await this.storageService.get(LOGS_PREFIX);
    console.log("fetched logs: ");
    console.log(storedLogs);
    
    let cameraLogs: CameraLog[] = [];
    
    if (storedLogs) {
      try {
        cameraLogs = JSON.parse(storedLogs);
      } catch (e) {
        console.error('Error parsing camera logs:', e);
      }
    }
    console.log("parsed Camera logs: . This will be set as camerLogs state.");
    console.log(cameraLogs);
    this.cameraLogs.set(cameraLogs);
  }
  
   //TODO com enviem a correu electrònic 
   public sendCameraLogs(): Observable<CameraLog[]|undefined>{
    console.log("sendCameraLogs function executed");
    alert("Send camera logs executed (pending implementation)");
    return this.http.post<CameraLog[]|undefined>('', {});
    
  }

  constructor() {
  }

}
