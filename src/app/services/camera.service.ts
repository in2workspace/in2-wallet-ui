import { computed, effect, Injectable, signal, inject } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, map, shareReplay, take, tap } from 'rxjs';
import { StorageService } from './storage.service';
import { ToastServiceHandler } from './toast.service';
import { CameraLogsPage } from '../pages/logs/camera-logs/camera-logs.page';
import { CameraLogsService } from './camera-logs.service';
import { CameraLogType } from '../interfaces/camera-log';

@Injectable({
  providedIn: 'root',
})
export class CameraService {
  private cameraLogsService = inject(CameraLogsService);
  private storageService = inject(StorageService);
  private toastService = inject(ToastServiceHandler);

  public selectedCamera$ = signal<MediaDeviceInfo|undefined>(undefined);
  public computedSelectedCameraLabel$ = computed(() => this.selectedCamera$()?.label);
  public availableDevices$ = signal<MediaDeviceInfo[]>([]);
  public isCameraError$ = signal<boolean|undefined>(undefined);
  public activatingBarcodeListSubj = new BehaviorSubject<string[]>([])
  public activatingBarcodeList$ = this.activatingBarcodeListSubj.asObservable()
  // .pipe(
  //   tap(list => {
  //     console.log('update barcode on destroy list: ');
  //     console.log(list);
  //   })
  // );

  public addActivatingBarcode(barcodeId:string){
    // console.log('SERVICE: addDestroyingBarcode: ' + barcodeId);
    const destroyingBarcode = this.activatingBarcodeListSubj.getValue();
    this.activatingBarcodeListSubj.next([...destroyingBarcode, barcodeId]);
  }

  public removeActivatingBarcode(barcodeId:string){
    const destroyingBarcode = this.activatingBarcodeListSubj.getValue();
    const updatedList = destroyingBarcode.filter(id => id !== barcodeId);
    this.activatingBarcodeListSubj.next([...updatedList]);
  }

  //todo
//   public updateSelecteCameraEffect = effect(() => { 
//     console.log('SERVICE: updated camera: ' + this.selectedCamera$()?.label
// );
//   });

  public setCamera(camera: MediaDeviceInfo) {
    // console.log('SERVICE: set camera');
    this.selectedCamera$.set(camera);
    const storedCamera = {
      deviceId: camera.deviceId,
      label: camera.label,
      kind: camera.kind,
    };
    this.storageService.set('camera', storedCamera);
  }

  public getAvailableCameraById(id: string){
    // console.log('SERVICE: getAvailableCameraById');
    const devices = this.availableDevices$();
    return devices.filter(device  => device.deviceId === id )[0];
  }

  //todo estats amb enum
  public async getCameraFlow(): Promise<MediaDeviceInfo|'PERMISSION_DENIED'|'NO_CAMERA_AVAILABLE'> {
    // console.log('SERVICE: STARTING getCameraFlow');
    this.isCameraError$.set(false);

    try{
      await this.getCameraPermissionAndStopTracks();
    }catch(e: any){
      this.handleCameraErrors(e, 'fetchError');
      return 'PERMISSION_DENIED';
    }

    let availableDevices = await this.updateAvailableCameras();
    if(availableDevices.length === 0){
      this.handleCameraErrors({name: 'CustomNoAvailable'}, 'fetchError');
      return 'NO_CAMERA_AVAILABLE';
    }

    const selectedCamera = await this.getCameraFromAvailables();
    if(selectedCamera === 'NO_CAMERA_AVAILABLE'){
      this.handleCameraErrors({name: 'CustomNoAvailable'}, 'fetchError');
    }
    return selectedCamera;
  }

  //1
  public async getCameraPermissionAndStopTracks(){
    // console.log('SERVICE: getCameraPermissionAndStopTracks')
    try{
      const stream = await navigator.mediaDevices.getUserMedia({video: true});
      this.stopMediaTracks(stream); //necessary? crec que sí per si s'està utilitzant la càmera en un altre lloc
      return true;
    }catch(e: any){
      throw e;
  }
}

//2
//should be called only if permission is granted
public async updateAvailableCameras(): Promise<MediaDeviceInfo[]> {
  // console.log('SERVICE: updateAvailableCameras');
  const devices = await navigator.mediaDevices.enumerateDevices();
  const videoinputDevices = devices.filter((device) => device.kind === 'videoinput');
  this.availableDevices$.set(videoinputDevices);
  return videoinputDevices;
}

//3
//obtenir càmera seleccionada; si no, stored; si no, qualsevol de les available (ja obtingudes); si no, undefined...
public async getCameraFromAvailables(): Promise<MediaDeviceInfo|'NO_CAMERA_AVAILABLE'> {
  // console.log('SERVICE: getCameraFromAvailables');
  const selectedCamera = this.selectedCamera$();
  if(selectedCamera && this.isCameraAvailableById(selectedCamera.deviceId)) return selectedCamera;

  const cameraFromStorage = await this.getCameraFromStorage(); //comprova si és available
  if(cameraFromStorage  && this.isCameraAvailableById(cameraFromStorage.deviceId)){
    this.selectedCamera$.set(cameraFromStorage);
    return cameraFromStorage;
  }

  const defaultCamera = await this.getDefaultAvailableCamera();
  if(defaultCamera && this.isCameraAvailableById(defaultCamera.deviceId)){
    this.setCamera(defaultCamera);
    return defaultCamera;
  }

  return 'NO_CAMERA_AVAILABLE';
}

  public async getCameraFromStorage(): Promise<MediaDeviceInfo|undefined> {
    // console.log('SERVICE: getCameraFromStorage');
    const storedCamera = await this.storageService.get('camera');
    // const storedCamera  = JSON.parse(storedCameraUnparsed) as MediaDeviceInfo;
    // console.log('Camera from storage:');
    // console.log(storedCamera);
    const isValidMediaDeviceInfo = this.isValidMediaDeviceInfo(storedCamera);

    if (storedCamera !== null && isValidMediaDeviceInfo) {
      return storedCamera;
    }
    return undefined;
  }

  public async getDefaultAvailableCamera(){
    // console.log('SERVICE: getDefaultAvailableCamera');
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
    // console.log('SERVICE: set UNDEFINED camera');
    await this.storageService.remove('camera');
    this.selectedCamera$.set(undefined);
  }

  public stopMediaTracks(stream: MediaStream): void {
    // console.log('SERVICE: stop Media Tracks');
    // console.log('stream to stop: ');
    // console.log(stream);
    stream.getTracks().forEach((track) => {
      // console.log('track in stopMediaTracks: ');
      // console.log(track);
      track.stop()});
  }

  //todo enum or map with possible error labels
  public handleCameraErrors(e: Error | { name: string }, type?: CameraLogType) {
    // console.error(e);
    this.isCameraError$.set(true);
    this.alertCameraErrorsByErrorName(e.name);
  
    const errorInstance: Error = e instanceof Error ? e : new Error(e.name);
    
    this.cameraLogsService.addCameraLog(errorInstance, type ?? 'undefinedError');
  }

  public alertCameraErrorsByErrorName(errMsg: string) {
    // console.log('SERVICE: alert camera errors: ' + errMsg);
    
    let errorLabel = 'errors.camera.default';
  
    if (errMsg.startsWith('NotReadableError')) {
      errorLabel = 'errors.camera.not-readable';
    } else if (errMsg.startsWith('NotAllowedError')) {
      errorLabel = 'errors.camera.not-allowed';
    } else if (errMsg.startsWith('NotFoundError') || errMsg.startsWith('CustomNoAvailable')) {
      errorLabel = 'errors.camera.not-found';
    } else if (errMsg.startsWith('OverconstrainedError')) {
      errorLabel = 'errors.camera.overconstrained';
    } else if (errMsg.startsWith('SecurityError')) {
      errorLabel = 'errors.camera.security';
    } else if (errMsg.startsWith('AbortError')) {
      errorLabel = 'errors.camera.abort';
    } else if (errMsg.startsWith('TypeError')) {
      errorLabel = 'errors.camera.type';
    } else if (errMsg.startsWith('NotSupportedError')) {
      errorLabel = 'errors.camera.not-supported';
    }
  
    this.toastService.showErrorAlertByTranslateLabel(errorLabel)
      .pipe(take(1))
      .subscribe();
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
    // console.log('User agent:');
    // console.log(ua);
    const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
    return !isSafari;
  }

}