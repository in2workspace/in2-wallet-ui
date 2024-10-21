import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, shareReplay, tap } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class CameraService {
  public mediaDeviceInfoNull: MediaDeviceInfo|undefined = undefined;
  //TODO camera?
  public camara = new BehaviorSubject<MediaDeviceInfo|undefined>(
    this.mediaDeviceInfoNull
  );
  //TODO remove tap
  public navCamera$ = this.camara.asObservable().pipe(
    distinctUntilChanged(),
    shareReplay(1),
    );

  public constructor(private storageService: StorageService) {
    this.updateCamera();
  }

  public changeCamera(camara: MediaDeviceInfo) {
    this.camara.next(camara);
    this.storageService.set('camara', camara);
  }

  //TODO when stored camera is not valid, should components know (camera-selector.page selector for ex.)?
  public async updateCamera() {
    const result = await this.storageService.get('camara');
    console.log('Camera from storage:' + result);

    if (result != null && this.isValidMediaDeviceInfo(result)) {
      const isAvailable = await this.isCameraAvailable(result);
      
      if (isAvailable) {
        this.camara.next(result);
      } else {
        console.warn('Stored camera not available');
        this.noCamera();
      }
    } else {
      console.error('Stored camera is not valid or null');
      this.noCamera();
    }
  }

  public noCamera() {
    this.storageService.remove('camara');
    this.camara.next(this.mediaDeviceInfoNull);
  }

  public async isCameraAvailable(camera: MediaDeviceInfo): Promise<boolean> {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const availableCamera = devices.find(
      (device) => device.deviceId === camera.deviceId && device.kind === 'videoinput'
    );
    return !!availableCamera;
  }

  private isValidMediaDeviceInfo(object: any): object is MediaDeviceInfo {
    return (
      object &&
      typeof object.deviceId === 'string' &&
      typeof object.label === 'string' &&
      typeof object.kind === 'string' &&
      object.kind === 'videoinput'
    );
  }
}
