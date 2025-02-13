import { CameraLogsService } from './../../services/camera-logs.service';
import { CommonModule } from '@angular/common';
import { v4 as uuidv4 } from 'uuid';
import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  ViewChild,
  WritableSignal,
  effect
} from '@angular/core';
import { BarcodeFormat, Exception } from '@zxing/library';
import { ZXingScannerModule, ZXingScannerComponent } from '@zxing/ngx-scanner';
import {
  BehaviorSubject,
  Subject,
  debounceTime,
  distinctUntilChanged,
  filter,
  interval,
  map,
  shareReplay,
  switchMap,
  take,
  takeUntil
} from 'rxjs';
import { CameraLogType } from 'src/app/interfaces/camera-log';
import { CameraService } from 'src/app/services/camera.service';
import { RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

// ! Since console.error is intercepted (to capture the error already caught by zxing), be careful to avoid recursion
// ! (i.e., console.error should not be called within the execution flow of another console.error)

//when a barcode component is created, it waits for the "destroying barcode list" is empty
//a barcode component is removed from such list not right after being destroyed, but after some delay,
//This delay is due to a time range in which the camera stream is deactivated after destroying scanner component
//Without this delay, if user tries to switch fast betwee two barcode pages, the barcode might be blocked

@Component({
  selector: 'app-barcode-scanner',
  templateUrl: './barcode-scanner.component.html',
  styleUrl:'./barcode-scanner.component.scss' ,
  standalone: true,
  imports: [CommonModule, ZXingScannerModule, RouterModule, TranslateModule, IonicModule],
})
export class BarcodeScannerComponent implements OnInit {
  @Output() public qrCode: EventEmitter<string> = new EventEmitter();
  @ViewChild('scanner') public scanner!: ZXingScannerComponent;
  public allowedFormats = [BarcodeFormat.QR_CODE];
  firstActivationCompleted = false;
  private readonly barcodeId = uuidv4();

  //COUNTDOWN
  public readonly isError$ = this.cameraService.isCameraError$;
  private readonly activationTimeoutInSeconds = 4;
  private readonly activatedScanner$$ = new Subject<void>();
  private readonly activationCountdown$ = this.activatedScanner$$.pipe( //todo test
    switchMap(() => interval(1000)
      .pipe(
        take(this.activationTimeoutInSeconds + 1),
        takeUntil(this.destroy$),
        map(seconds => this.activationTimeoutInSeconds * 1000 - seconds * 1000),
        // tap(val=>console.log('BARCODE - COUNTDOWN: ' + val))
      )
    ),
    shareReplay(1),
  );
  private readonly activationCountdownValue$ = toSignal(this.activationCountdown$, {initialValue:6000});

  //todo: is assigned CameraService.selectedDevice after scanner is autostarted (?)
  public readonly selectedDevice$: WritableSignal<MediaDeviceInfo|undefined> = this.cameraService.selectedCamera$;
  private readonly updateScannerDeviceEffect = effect(async () => { //todo test
    const selectedDevice = this.selectedDevice$();
    if(this.firstActivationCompleted && this.scanner && selectedDevice && this.scanner.device !== selectedDevice){
      // console.log('BARCODE: device changed: ' + selectedDevice.label);
      const hasPermission = await this.scanner.askForPermission()
        // console.log('BARCODE: permission after device changed')
        if(hasPermission){
          this.scanner.device = selectedDevice;
          this.activatedScanner$$.next();
        }else{
          console.error('BARCODE: Permission denied');
        }
  }else{
    // console.log('BARCODE: efecte anul·lat; first activation completed? ' + this.firstActivationCompleted);
  }});
  private readonly isActivatingBarcode$ = toSignal(this.cameraService.activatingBarcodeList$);


  private readonly scanFailureSubject = new Subject<Error>();
  private readonly scanFailureDebounceDelay = 3000;
  private originalConsoleError: undefined|((...data: any[]) => void);

  public scanSuccess$ = new BehaviorSubject<string>('');  
  public destroy$ = new Subject<void>();


  public constructor(
    private readonly cameraService: CameraService,
    private readonly cameraLogsService: CameraLogsService
  ) {

      // Requires debounce since this type of error is emitted constantly
      this.scanFailureSubject.pipe( //todo test
        distinctUntilChanged((
          previous, current) => 
            JSON.stringify(previous) === JSON.stringify(current)),
        debounceTime(this.scanFailureDebounceDelay)
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(err=>{
        this.saveErrorLog(err, 'scanFailure');
      });

    }
  
    public async ngOnInit(): Promise<void> {
      // console.log('BARCODE: on init from' + this.parentComponent)
      this.modifyConsoleErrorToSaveScannerErrors();
    }
  
    public async ngAfterViewInit(): Promise<void> {
      this.initCameraIfNoActivateBarcodes();
    }

    public ngOnDestroy(): void {
      // console.warn('BARCODE: on destroy from ' + this.parentComponent);
      this.destroy$.next();
      this.setActivatingTimeout();
      this.restoreOriginalConsoleError();
      this.cameraService.isCameraError$.set(false);
    }

    //todo test
    public async initCameraIfNoActivateBarcodes(): Promise<void>{
       //activate scanner once there are no other barcode in deactivation process
       const activatingBarcodeList = this.isActivatingBarcode$();
      //  console.log('BARCODE (afterViewInit): check current barcode in destroying process list before starting camera flow: ' + activatingBarcodeList);
       if (activatingBarcodeList?.length === 0) {
        //  console.log('BARCODE: since there are no barcode components being destroyed, get camera flow')
         //todo agrupar en una funció el cameraflow + activate + firstactivation
         const cameraFlowResult = await this.cameraService.getCameraFlow(); 
         if(cameraFlowResult === 'NO_CAMERA_AVAILABLE' || cameraFlowResult === 'PERMISSION_DENIED'){
          console.warn('BARCODE: camera flow not completed; scanner will not be activated.');
          return;
        }
        //  console.log('BARCODE: camera flow completed: ' + this.parentComponent);
         this.activateScannerInitially();
       } else {
         console.warn('BARCODE: there is at least one destroying barcode, waiting for starting camera flow')
         this.cameraService.activatingBarcodeList$
           .pipe(
             filter(value => value.length === 0),
             takeUntil(this.destroy$),
             take(1),
           )
           .subscribe(async () => {
             const cameraFlowResult = await this.cameraService.getCameraFlow(); 
             if(cameraFlowResult === 'NO_CAMERA_AVAILABLE' || cameraFlowResult === 'PERMISSION_DENIED'){
              // console.warn('BARCODE: camera flow not completed; scanner will not be activated.');
              return;
            }
            //  console.log('BARCODE: camera flow completed: ' + this.parentComponent);
            //  console.log('BARCODE: there are no destroying barcodes in the list, starting camera flow')
             this.activateScannerInitially();
           });
       }
    }

  public async activateScanner(): Promise<void>{
    // console.log('BARCODE: activating scanner: ' + this.parentComponent)
    if(this.scanner){
      this.scanner.enable = true;
      const hasPermission = await this.scanner.askForPermission();
      // console.log('BARCODE: Permission to activacte scanner: ' + hasPermission);
        if(this.scanner.device?.deviceId !== this.selectedDevice$()?.deviceId && hasPermission){
          this.scanner.device = this.selectedDevice$();
          this.activatedScanner$$.next();
          // console.log('BARCODE: end of activateScanner')
          // console.warn('Activation process of the scanner es pot allargar');
        }
    }
  }

  public async activateScannerInitially(): Promise<void>{
    await this.activateScanner();
    this.firstActivationCompleted = true;  
  }

  public onCodeResult(resultString: string): void {
    this.qrCode.emit(resultString);
  }

  public onScanError(error: Error): void{
    this.saveErrorLog(error, 'scanError');
  }

  public onScanFailure(error: Exception|undefined): void{
    const exception: Error = error ?? new Error('Undefined scan failure');
    this.scanFailureSubject.next(exception);
  }

  public saveErrorLog(error: Error|undefined, exceptionType: CameraLogType): void {
    this.cameraLogsService.addCameraLog(error, exceptionType);
  }

  public setActivatingTimeout(): void{
    this.cameraService.addActivatingBarcode(this.barcodeId);
    const activationCountDownValue = this.activationCountdownValue$();
    // console.log('BARCODE: activation countdown value: ' + activationCountDownValue);

    setTimeout(() => {
        // console.warn('BARCODE: scanner destroyed after' + activationCountDownValue + 'timeout from ' + this.parentComponent);
        this.scanner.enable = false;
        this.cameraService.removeActivatingBarcode(this.barcodeId);
      }, activationCountDownValue );
  }


  public modifyConsoleErrorToSaveScannerErrors(): void{
    //Redefine console.log to capture the errors that were previously captured by zxing-scanner
    this.originalConsoleError = console.error;
    console.error = (message?: string, ...optionalParams: any[]) => {
      if(message === "@zxing/ngx-scanner"){
        const logMessage = formatLogMessage(message, optionalParams);
        //todo revisar
        const err = {...new Error(logMessage), name: optionalParams[1]};
        const errorType = optionalParams[0] === 
          "Can't get user media, this is not supported." ?
          'noMediaError' :
          'undefinedError';

          console.log('modified console error before handle')
        this.cameraService.handleCameraErrors(err, errorType);
        return;
      }

      if (this.originalConsoleError) {
        this.originalConsoleError(message, ...optionalParams);
      }
      
     };
  }

  public restoreOriginalConsoleError(): void{
    if(this.originalConsoleError){
      console.error = this.originalConsoleError;
    }
  }

}

export function formatLogMessage(message: any, optionalParams: any[]): string {
  const optionalParam1 = optionalParams.length > 0 ? optionalParams[0] : '';
  const optionalParam2 = optionalParams.length > 1 ? optionalParams[1] : '';
  return `${String(message)}. ${String(optionalParam1)} ${String(optionalParam2)}`;
}