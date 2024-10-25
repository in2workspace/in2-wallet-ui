import { environment } from './../../environments/environment';
import { inject, Injectable } from '@angular/core';
import { CameraLog, CameraLogType, LogsMailContent } from '../interfaces/camera-log';
import { StorageService } from './storage.service';

export const LOGS_PREFIX = 'CAMERA_LOGS';

@Injectable({
  providedIn: 'root'
})
export class CameraLogsService {
  private readonly storageService = inject(StorageService);

  private cameraLogs: CameraLog[]|undefined = undefined;

  async getCameraLogs(): Promise<CameraLog[]> {
    if (!this.cameraLogs) {
      await this.fetchCameraLogs();
    }
    return this.cameraLogs || [];
  }

  public setCameraLogs(logs: CameraLog[]): void{
    this.cameraLogs = [...logs];
  }

  public async fetchCameraLogs(): Promise<void> {
    try {
      const unparsedStoredLogs = await this.storageService.get(LOGS_PREFIX);
      const storedLogs: CameraLog[] = unparsedStoredLogs ? JSON.parse(unparsedStoredLogs) : [];
      this.cameraLogs = [...storedLogs];

    } catch (error: any) {
      console.error('Error fetching logs:', error);
      this.addCameraLog(error.message || 'Unknown error', 'fetchError');
    }
  }  

  public async addCameraLog(err: Error | undefined, exceptionType: CameraLogType): Promise<void> {
    const log: CameraLog = {
      type: exceptionType,
      message: err?.message ?? 'undefined error',
      date: timestampUntilMinutes()
    };
  
    const storedLogs = await this.getCameraLogs();
    const updatedLogs = [...storedLogs, log];

    if(storedLogs.length >= 50){
      updatedLogs.splice(0, updatedLogs.length - 50);
    }

  
    await this.storageService.set(LOGS_PREFIX, JSON.stringify(updatedLogs));
    this.setCameraLogs(updatedLogs);
  }
  

  //sends through mailTo the last logs that fit in 1200 characters (message body limit aprox.)
  public async sendCameraLogs() {
    const logs = await this.getCameraLogs();
  
    if (logs.length === 0) {
      alert("Could not find any stored log");
      return;
    }
  
    const maxChars = 1500;
    let emailBody = '';
    
    const reversedLogs = [...logs].reverse();
    reversedLogs.some(log => {
      const logString = JSON.stringify(log);
      if ((emailBody.length + logString.length) > maxChars) {
        return true;
      }
      emailBody = logString + '\n' + emailBody;
      return false;
    });
  
    const msg: LogsMailContent = {
      subject: 'Camera Logs',
      body: emailBody.trim(),
    };
  
    const mailtoLink = `mailto:${environment.logs_email}?subject=${encodeURIComponent(msg.subject)}&body=${encodeURIComponent(msg.body)}`;
    window.open(mailtoLink, '_blank');
  }

}

export function timestampUntilMinutes(){
  const timeStamp = new Date();
  return timeStamp.getFullYear() + "-" +
    String(timeStamp.getMonth() + 1).padStart(2, '0') + "-" +
    String(timeStamp.getDate()).padStart(2, '0') + " " +
    String(timeStamp.getHours()).padStart(2, '0') + ":" +
    String(timeStamp.getMinutes()).padStart(2, '0');
}
