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
    toJSON() {
    },
  };
  private camara =
    new BehaviorSubject<MediaDeviceInfo>(this.mediaDeviceInfoNull);
  navCamera$ = this.camara.asObservable();
  constructor(private storageService: StorageService) {
    this.updateCamera();
  }

  changeCamera(camara: MediaDeviceInfo) {
    this.camara.next(camara);
    this.storageService.set('camara', camara);
  }

  updateCamera() {
    this.storageService.get('camara').then((result) => {
      if (result != null) {
        this.camara.next(result);
      }
    });
  }

  noCamera() {
    this.storageService.remove('camara');
    this.camara.next(this.mediaDeviceInfoNull);
  }

}
