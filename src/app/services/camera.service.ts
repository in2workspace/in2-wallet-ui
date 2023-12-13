import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {StorageService} from './storage.service';

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
  private camara: BehaviorSubject<MediaDeviceInfo> =
    new BehaviorSubject<MediaDeviceInfo>(this.mediaDeviceInfoNull);
  navCamera$ = this.camara.asObservable();
  private enabled: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  navEnabled$ = this.enabled.asObservable();

  constructor(private storageService: StorageService) {
  }

  changeCamera(camara: MediaDeviceInfo) {
    this.enabled.next(true);
    this.camara.next(camara);
    // fixme: this.router.navigate() needs then().
    this.storageService.set('camara', camara);
  }

  updateCamera() {
    this.storageService.get('camara').then((result) => {
      if (result != null) {
        this.enabled.next(true);
        this.camara.next(result);
      }
    });
  }

  noCamera() {
    this.enabled.next(false);
    // fixme: this.router.navigate() needs then().
    this.storageService.remove('camara');
  }

}
