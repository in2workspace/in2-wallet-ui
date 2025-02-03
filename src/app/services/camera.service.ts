import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, shareReplay } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class CameraService {
  public selectedCamera$ = signal<MediaDeviceInfo|undefined>(undefined);
  public availableDevices$ = signal<MediaDeviceInfo[]>([]);
  public hasCameraPermission$ = signal<boolean|undefined>(undefined);

  public constructor(private storageService: StorageService) {
  }

  public changeCamera(camera: MediaDeviceInfo) {
    this.selectedCamera$.set(camera);
    const storedCamera = {
      deviceId: camera.deviceId,
      label: camera.label,
      kind: camera.kind,
    };
    this.storageService.set('camera', storedCamera);
  }

  //todo return something?
  //todo estats amb enum
  public async getCameraFlow(): Promise<MediaDeviceInfo|'PERMISSION_DENIED'|'NO_CAMERA_AVAILABLE'> {
    this.hasCameraPermission$.set(undefined);
    const hasPermission = await this.getCameraPermission();
    if(!hasPermission){
      console.error('Camera permission denied');
      return'PERMISSION_DENIED';
    }
    this.hasCameraPermission$.set(true); //

    let availableDevices = await this.updateAvailableCameras();
    if(availableDevices.length === 0){
      console.error('No camera available');
      return 'NO_CAMERA_AVAILABLE';
    }

    const selectedCamera = await this.getCameraFromAvailables();
    return selectedCamera;
  }

  //1
  public async getCameraPermission(){
    try{
      const stream = await navigator.mediaDevices.getUserMedia({video: true});
      this.stopMediaTracks(stream); //necessary? crec que sí per si s'està utilitzant la càmera en un altre lloc
      return true;
    }catch(e){
      console.error('Camera permission denied');
      return false;
  }
}

//2
//should be called only if permission is granted
public async updateAvailableCameras(): Promise<MediaDeviceInfo[]> {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const videoinputDevices = devices.filter((device) => device.kind === 'videoinput');
  this.availableDevices$.set(videoinputDevices);
  return videoinputDevices;
}

//3
//obtenir càmera seleccionada; si no, stored; si no, qualsevol de les available (ja obtingudes); si no, undefined...
public async getCameraFromAvailables(): Promise<MediaDeviceInfo|'NO_CAMERA_AVAILABLE'> {
  const selectedCamera = this.selectedCamera$();
  if(selectedCamera && this.isCameraAvailableById(selectedCamera.deviceId)) return selectedCamera;

  const cameraFromStorage = await this.getCameraFromStorage(); //comprova si és available
  if(cameraFromStorage  && this.isCameraAvailableById(cameraFromStorage.deviceId)){
    this.selectedCamera$.set(cameraFromStorage);
    return cameraFromStorage;
  }

  const defaultCamera = await this.getDefaultAvailableCamera();
  if(defaultCamera && this.isCameraAvailableById(defaultCamera.deviceId)){
    this.changeCamera(defaultCamera);
    return defaultCamera;
  }

  return 'NO_CAMERA_AVAILABLE';
}

  public async getCameraFromStorage(): Promise<MediaDeviceInfo|undefined> {
    const storedCamera = await this.storageService.get('camera');
    // const storedCamera  = JSON.parse(storedCameraUnparsed) as MediaDeviceInfo;
    console.log('Camera from storage:');
    console.log(storedCamera);
    const isValidMediaDeviceInfo = this.isValidMediaDeviceInfo(storedCamera);

    if (storedCamera !== null && isValidMediaDeviceInfo) {
      return storedCamera;
    }
    return undefined;
  }

  public async getDefaultAvailableCamera(){
    const defaultCamera = this.availableDevices$().find((device) => /back|rear|environment/gi.test(device.label));
    return defaultCamera ?? this.availableDevices$()[0];
  }

  public isCameraAvailableById(cameraId: string): boolean {
    const availableCamera = this.availableDevices$().find(
      (device) => device.deviceId === cameraId && device.kind === 'videoinput'
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

  public async setUndefinedCamera() {
    await this.storageService.remove('camera');
    this.selectedCamera$.set(undefined);
  }

  private stopMediaTracks(stream: MediaStream): void {
    stream.getTracks().forEach((track) => track.stop());
  }

  public isIOSVersionLowerThan(version: number): boolean {
    const match = navigator.userAgent.match(/OS (\d+)_/);
    if (match) {
      const iosVersion = parseInt(match[1], 10);
      return iosVersion < version;
    }
    return false;
  }
  
  public isNotSafari(): boolean {
    const ua = navigator.userAgent;
    const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
    return !isSafari;
  }

}