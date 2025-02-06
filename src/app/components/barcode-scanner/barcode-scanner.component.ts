import { CameraLogsService } from './../../services/camera-logs.service';
import { CommonModule } from '@angular/common';
import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  ViewChild,
  signal,
  WritableSignal,
  Input,
  ChangeDetectorRef,
  effect
} from '@angular/core';
import { BarcodeFormat, Exception } from '@zxing/library';
import { ZXingScannerModule, ZXingScannerComponent } from '@zxing/ngx-scanner';
import {
  BehaviorSubject,
  Subject,
  Subscription,
  debounceTime,
  delayWhen,
  distinctUntilChanged,
  filter,
  interval,
  map,
  shareReplay,
  startWith,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { CameraLogType } from 'src/app/interfaces/camera-log';
import { CameraService } from 'src/app/services/camera.service';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

// ! Since console.error is intercepted (to capture the error already caught by zxing), be careful to avoid recursion
// ! (i.e., console.error should not be called within the execution flow of another console.error)

//when a barcode component is created, it waits for the "destroying barcode list" is empty
//a barcode component is removed from such list not right after being destroyed, but after some delay,
//This delay is due to a time range in which the camera stream is deactivated after destroying scanner component
//Without this delay, if user tries to switch fast betwee two barcode pages, the barcode might be blocked

@Component({
  selector: 'app-barcode-scanner',
  templateUrl: './barcode-scanner.component.html',
  standalone: true,
  imports: [CommonModule, ZXingScannerModule, RouterModule],
})
export class BarcodeScannerComponent implements OnInit {
  @Input() public parentComponent: string = '';
  @Output() public qrCode: EventEmitter<string> = new EventEmitter();
  @ViewChild('scanner') public scanner!: ZXingScannerComponent;
  public allowedFormats = [BarcodeFormat.QR_CODE];
  autoStart = false;
  firstActivationCompleted = false;
  private barcodeId = Math.random().toString();

  //COUNTDOWN
  private activationTimeoutInSeconds = 4;
  private activateScanner$$ = new Subject<void>();
  private activationCountdown$ = this.activateScanner$$.pipe(
    switchMap(() => interval(1000)
      .pipe(
        //todo
        take(this.activationTimeoutInSeconds + 1),
        map(seconds => this.activationTimeoutInSeconds * 1000 - seconds * 1000),
        tap(val=>console.log('BARCODE - COUNTDOWN: ' + val))
      )
    ),
    // startWith(6000),
    shareReplay(1),
  );
  private activationCountdownValue$ = toSignal(this.activationCountdown$, {initialValue:6000});

  //is assigned CameraService.selectedDevice after scanner is autostarted
  public selectedDevice$: WritableSignal<MediaDeviceInfo|undefined> = this.cameraService.selectedCamera$;
  private updateScannerDeviceEffect = effect(() => {
    const selectedDevice = this.selectedDevice$();
    if(this.firstActivationCompleted && this.scanner && selectedDevice && this.scanner.device !== selectedDevice){
      console.log('BARCODE: device changed: ' + selectedDevice.label);
      this.scanner.askForPermission().then((hasPermission) => {
        console.log('BARCODE: permission after device changed')
        if(hasPermission){
          this.scanner.device = selectedDevice;
          this.activateScanner$$.next();
        }else{
          console.error('BARCODE: Permission denied');
          alert('Permission denied. Please allow camera access to continue.');
        }
      });
  }else{
    console.log('BARCODE: efecte anul·lat; first activation completed? ' + this.firstActivationCompleted);
  }});
  isActivatingBarcode$ = toSignal(this.cameraService.activatingBarcodeList$);


  readonly scanFailureSubject = new Subject<Error>();
  private readonly scanFailureDebounceDelay = 3000;
  private originalConsoleError: undefined|((...data: any[]) => void);

  public scanSuccess$ = new BehaviorSubject<string>('');  
  public destroy$ = new Subject<void>();


  public constructor(
    private readonly cameraService: CameraService,
    private readonly cameraLogsService: CameraLogsService,) {

      // Requires debounce since this type of error is emitted constantly
      this.scanFailureSubject.pipe(
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
  

    public async ngAfterViewInit() {
      //activate scanner once there are no other barcode in deactivation process
      const destroyingBarcodeList = this.isActivatingBarcode$();
      console.log('BARCODE (afterViewInit): check current barcode in destroying process list before starting camera flow: ' + destroyingBarcodeList);
      if (destroyingBarcodeList?.length === 0) {
        console.log('BARCODE: since there are no barcode components being destroyed, get camera flow')
        //todo agrupar en una funció el cameraflow + activate+firstactivation
        await this.cameraService.getCameraFlow(); 
        //potser faltaria condicional en cas de permission denied o no available devices
        console.log('BARCODE: camera flow completed: ' + this.parentComponent);
        this.activateScanner();
        this.firstActivationCompleted = true;
      } else {
        console.warn('BARCODE: there is at least one destroying barcode, waiting for starting camera flow')
        this.cameraService.activatingBarcodeList$
          .pipe(
            filter(value => value.length === 0),
            takeUntil(this.destroy$),
            take(1),
          )
          .subscribe(async () => {
            await this.cameraService.getCameraFlow(); 
            console.log('BARCODE: camera flow completed: ' + this.parentComponent);
            console.log('BARCODE: there are no destroying barcodes in the list, starting camera flow')
            this.activateScanner();
            this.firstActivationCompleted = true;
          });
      }
    }

  public activateScanner(){
    console.log('BARCODE: activating scanner: ' + this.parentComponent)
    if(this.scanner){
      this.scanner.enable = true;
      this.scanner.askForPermission().then((hasPermission) => {
        console.log('BARCODE: Permission to activacte scanner: ' + hasPermission);
        if(this.scanner.device !== this.selectedDevice$()){
          this.scanner.device = this.selectedDevice$();
          this.activateScanner$$.next();
          console.log('BARCODE: end of activateScanner')
          console.warn('Activation process of the scanner es pot allargar');
        }
      });
    }
  }

  public async ngOnInit(): Promise<void> {
    console.log('BARCODE: on init from' + this.parentComponent)
    this.modifyConsoleError();
  }

  public ngOnDestroy() {
    console.warn('BARCODE: on destroy from ' + this.parentComponent);
    this.destroy$.next();
    this.setActivatingTimeout();
    this.restoreOriginalConsoleError();
  }


  public onCodeResult(resultString: string) {
    this.qrCode.emit(resultString);
  }

  public onScanError(error: Error){
    this.saveErrorLog(error, 'scanError');
  }

  public onScanFailure(error: Exception|undefined){
    const exception: Error = error ?? new Error('Undefined scan failure');
    this.scanFailureSubject.next(exception);
  }

  public saveErrorLog(error: Error|undefined, exceptionType: CameraLogType) {
    this.cameraLogsService.addCameraLog(error, exceptionType);
  }

  public setActivatingTimeout(){
    this.cameraService.addActivatingBarcode(this.barcodeId);
    const activationCountDownValue = this.activationCountdownValue$();
    console.log('BARCODE: activation countdown value: ' + activationCountDownValue);

    setTimeout(() => {
        console.warn('BARCODE: scanner destroyed after' + activationCountDownValue + 'timeout from ' + this.parentComponent);
        this.scanner.enable = false;
        this.cameraService.removeActivatingBarcode(this.barcodeId);
      }, activationCountDownValue );
  }

  private modifyConsoleError(){
    //Redefine console.log to capture the errors that were previously captured by zxing-scanner
    this.originalConsoleError = console.error;
    console.error = (message?: string, ...optionalParams: string[]) => {
      if(message==="@zxing/ngx-scanner"){
        const logMessage = formatLogMessage(message, optionalParams);
        const err = new Error(logMessage);

        if(optionalParams[0]==="Can't get user media, this is not supported."){
          alert("Error: " + optionalParams[0]);
          this.saveErrorLog(err, 'noMediaError');
        }else{
          // todo no sé si cal ara que ja controlem errors de permisos
          alert("Error: There was an error when trying to connect to the camera. It might be a permission error.");
          this.saveErrorLog(err, 'undefinedError');
        }
        return;
      }

      if (this.originalConsoleError) {
        this.originalConsoleError(message, ...optionalParams);
      }
      
     };
  }

  private restoreOriginalConsoleError(){
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