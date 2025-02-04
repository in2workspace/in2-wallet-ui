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
  debounceTime,
  delayWhen,
  distinctUntilChanged,
  filter,
  take,
} from 'rxjs';
import { CameraLogType } from 'src/app/interfaces/camera-log';
import { CameraService } from 'src/app/services/camera.service';
import { RouterModule } from '@angular/router';

// ! Since console.error is intercepted (to capture the error already caught by zxing), be careful to avoid recursion
// ! (i.e., console.error should not be called within the execution flow of another console.error)


@Component({
  selector: 'app-barcode-scanner',
  templateUrl: './barcode-scanner.component.html',
  standalone: true,
  imports: [CommonModule, ZXingScannerModule, RouterModule],
})
export class BarcodeScannerComponent implements OnInit {
  @Output() public qrCode: EventEmitter<string> = new EventEmitter();
  @ViewChild('scanner') public scanner!: ZXingScannerComponent;
  public allowedFormats = [BarcodeFormat.QR_CODE];
  autoStart = false;

  //is assigned CameraService.selectedDevice after scanner is autostarted
  public selectedDevice$: WritableSignal<MediaDeviceInfo|undefined> = this.cameraService.selectedCamera$;
  private updateScannerDeviceEffect = effect(() => {
    const selecteDevice = this.selectedDevice$();
    if(this.scanner && selecteDevice && this.scanner.device !== selecteDevice){
      console.log('BARCODE: device changed: ' + selecteDevice.label);
      this.scanner.askForPermission().then((hasPermission) => {
        console.log('BARCODE: permission after device changed')
        if(hasPermission){
          this.scanner.device = selecteDevice;
        }else{
          console.error('BARCODE: Permission denied');
          alert('Permission denied. Please allow camera access to continue.');
        }
      });
  }});


  readonly scanFailureSubject = new Subject<Error>();
  private readonly scanFailureDebounceDelay = 3000;
  private originalConsoleError: undefined|((...data: any[]) => void);

  public scanSuccess$ = new BehaviorSubject<string>('');
  public constructor(
    private readonly cameraService: CameraService,
    private readonly cameraLogsService: CameraLogsService) {
      // Requires debounce since this type of error is emitted constantly
      this.scanFailureSubject.pipe(
        distinctUntilChanged((
          previous, current) => 
            JSON.stringify(previous) === JSON.stringify(current)),
        debounceTime(this.scanFailureDebounceDelay)
      ).subscribe(err=>{
        this.saveErrorLog(err, 'scanFailure');
      });

    }

    public async ngAfterViewInit(){
      await this.cameraService.getCameraFlow(); 
      console.log('BARCODE: camera flow completd.')
      this.activateScanner();
  }
  public activateScanner(){
    console.log('BARCODE: activating scanner')
    if(this.scanner){
      this.scanner.enable = true;
      this.scanner.askForPermission().then((hasPermission) => {
        console.log('BARCODE: Permission from barcode.activateScanner: ' + hasPermission);
        if(this.scanner.device !== this.cameraService.selectedCamera$()){
        this.scanner.device = this.cameraService.selectedCamera$();
        }
      });
      
    }
  }

  public async ngOnInit(): Promise<void> {

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

  public ngOnDestroy() {
    //generally, when scanner is destroyed, its stream is closed; however, if the tab is switched very fast and scanner is still
    //setting device after getting permission, destroying the scanner will not close the stream; since the stream is internal to the scanner,
    //the only way is to wait for the scanner to finish setting the device and then close the stream
    //so normally this won't be necessary, only in the case of a very fast tab switch
      setTimeout(() => {
        console.log('BARCODE: scanner destroyed timeout');
        this.scanner.enable = false;
      }, 4000);

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