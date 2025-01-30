import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, shareReplay } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class CameraService {
  public mediaDeviceInfoNull: MediaDeviceInfo|undefined = undefined;
  public cameraSubj = new BehaviorSubject<MediaDeviceInfo|undefined>(
    this.mediaDeviceInfoNull
  );
  public navCamera$ = this.cameraSubj.asObservable().pipe(
    distinctUntilChanged(),
    shareReplay(1),
    );

  private storageService = inject(StorageService);

  public constructor() {
    this.updateCamera();
  }

  public changeCamera(camera: MediaDeviceInfo) {
    this.cameraSubj.next(camera);
    this.storageService.set('camera', camera);
  }

  public async updateCamera() {
    const storedCamera = await this.storageService.get('camera');
    console.log('Camera from storage:');
    console.log(storedCamera);

    if (storedCamera != null && this.isValidMediaDeviceInfo(storedCamera)) {
      const isAvailable = await this.isCameraAvailable(storedCamera);
      
      if (isAvailable) {
        this.cameraSubj.next(storedCamera);
      } else {
        console.warn('Stored camera not available');
        this.noCamera();
      }
    } else {
      console.warn('Stored camera is not valid or null');
      this.noCamera();
    }
  }

  public async noCamera() {
    await this.storageService.remove('camera');
    this.cameraSubj.next(this.mediaDeviceInfoNull);
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