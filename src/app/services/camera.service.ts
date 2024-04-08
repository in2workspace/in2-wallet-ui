import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class CameraService {
  public mediaDeviceInfoNull: MediaDeviceInfo = {
    deviceId: '',
    groupId: '',
    kind: 'audiooutput',
    label: '',
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    toJSON() {},
  };
  public camara = new BehaviorSubject<MediaDeviceInfo>(
    this.mediaDeviceInfoNull
  );
  public navCamera$ = this.camara.asObservable();

  public constructor(private storageService: StorageService) {
    this.updateCamera();
  }

  public changeCamera(camara: MediaDeviceInfo) {
    this.camara.next(camara);
    this.storageService.set('camara', camara);
  }

  public updateCamera() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.storageService.get('camara').then((result: any) => {
      if (result != null) {
        this.camara.next(result);
      }
    });
  }

  public noCamera() {
    this.storageService.remove('camara');
    this.camara.next(this.mediaDeviceInfoNull);
  }
}
