import { TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { CameraService } from './camera.service';
import { StorageService } from './storage.service';
import { ToastServiceHandler } from './toast.service';
import { signal } from '@angular/core';
import { EMPTY, of } from 'rxjs';

window.MediaStream = class {
  getTracks() {
    return [];
  }
} as any;

Object.defineProperty(window, 'MediaRecorder', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
      start: jest.fn(),
      ondataavailable: jest.fn(),
      onerror: jest.fn(),
      state: '',
      stop: jest.fn()
  }))
});

Object.defineProperty(MediaRecorder, 'isTypeSupported', {
  writable: true,
  value: () => true
});

const mockGetUserMedia = jest.fn(async () => {
  return new Promise<void>(resolve => {
      resolve()
  })
})

  Object.defineProperty(window.navigator, 'mediaDevices', {
    value: {
      getUserMedia: jest.fn(),
      enumerateDevices: jest.fn(),
    },
    writable: true
  });

class MockStorageService {
  private storage = new Map<string, any>();

  async set(key: string, value: any): Promise<void> {
    this.storage.set(key, value);
  }

  async get(key: string): Promise<any> {
    return this.storage.get(key);
  }

  async remove(key: string): Promise<void> {
    this.storage.delete(key);
  }
}

describe('CameraService', () => {
  let cameraService: CameraService;
  let mockStorageService: MockStorageService;
  let mockToastService: {
    showErrorAlertByTranslateLabel: jest.Mock
  }

  beforeEach(() => {
    mockToastService = {
      showErrorAlertByTranslateLabel: jest.fn().mockReturnValue(EMPTY)
    }
    TestBed.configureTestingModule({
      providers: [
        CameraService,
        { provide: StorageService, useClass: MockStorageService },
        { provide: ToastServiceHandler, useValue: mockToastService }
      ],
    });

    cameraService = TestBed.inject(CameraService);
    mockStorageService = TestBed.inject(StorageService) as unknown as MockStorageService;
  });


  it('hauria de mantenir múltiples barcodes a activatingBarcodeListSubj', () => {
    const barcode1 = '123ABC';
    const barcode2 = 'XYZ789';

    cameraService.addActivatingBarcode(barcode1);
    cameraService.addActivatingBarcode(barcode2);

    const currentList = cameraService.activatingBarcodeListSubj.getValue();
    
    expect(currentList).toContain(barcode1);
    expect(currentList).toContain(barcode2);
  });

  it('hauria d’emetre correctament la llista de barcodes a activatingBarcodeList$', (done) => {
    const barcode = 'TEST-BARCODE';

    cameraService.activatingBarcodeList$.subscribe((list) => {
      if (list.length > 0) {
        expect(list).toContain(barcode);
        done();
      }
    });

    cameraService.addActivatingBarcode(barcode);
  });

  describe('CameraService - removeActivatingBarcode', () => {
  
    it('hauria d’eliminar un barcode existent de activatingBarcodeListSubj', () => {
      const barcode1 = '123ABC';
      const barcode2 = 'XYZ789';
  
      cameraService.addActivatingBarcode(barcode1);
      cameraService.addActivatingBarcode(barcode2);
  
      // Comprovem que els dos barcodes s'han afegit
      expect(cameraService.activatingBarcodeListSubj.getValue()).toEqual([barcode1, barcode2]);
  
      // Eliminem el primer barcode
      cameraService.removeActivatingBarcode(barcode1);
  
      // Comprovem que només queda el segon barcode
      expect(cameraService.activatingBarcodeListSubj.getValue()).toEqual([barcode2]);
    });
  
    it('hauria de no canviar la llista si el barcode no existeix', () => {
      const barcode1 = '123ABC';
  
      cameraService.addActivatingBarcode(barcode1);
  
      // Intentem eliminar un barcode que no existeix
      cameraService.removeActivatingBarcode('NO-EXISTEIX');
  
      // Comprovem que la llista segueix igual
      expect(cameraService.activatingBarcodeListSubj.getValue()).toEqual([barcode1]);
    });
  
    it('hauria de deixar la llista buida si s’eliminen tots els barcodes', () => {
      const barcode1 = '123ABC';
      const barcode2 = 'XYZ789';
  
      cameraService.addActivatingBarcode(barcode1);
      cameraService.addActivatingBarcode(barcode2);
  
      // Eliminem els dos barcodes
      cameraService.removeActivatingBarcode(barcode1);
      cameraService.removeActivatingBarcode(barcode2);
  
      // Comprovem que la llista està buida
      expect(cameraService.activatingBarcodeListSubj.getValue()).toEqual([]);
    });
  
    it('hauria d’emetre correctament els valors actualitzats a activatingBarcodeList$', (done) => {
      const barcode1 = '123ABC';
      const barcode2 = 'XYZ789';
  
      cameraService.addActivatingBarcode(barcode1);
      cameraService.addActivatingBarcode(barcode2);
  
      cameraService.activatingBarcodeList$.subscribe((list) => {
        if (list.length === 1 && list[0] === barcode2) {
          expect(list).toEqual([barcode2]);
          done();
        }
      });
  
      cameraService.removeActivatingBarcode(barcode1);
    });
  });
  
  describe('CameraService - setCamera', () => {
  
    it('hauria de canviar la càmera seleccionada i guardar-la a StorageService', async () => {
      const mockCamera: MediaDeviceInfo = {
        deviceId: '123',
        label: 'Mock Camera',
        kind: 'videoinput',
        groupId: 'group1',
        toJSON: jest.fn(),
      };
  
      cameraService.setCamera(mockCamera);
  
      // Verifiquem que la càmera seleccionada s'ha actualitzat
      expect(cameraService.selectedCamera$()).toEqual(mockCamera);
  
      // Verifiquem que la càmera s'ha emmagatzemat correctament
      const storedCamera = await mockStorageService.get('camera');
      expect(storedCamera).toEqual({
        deviceId: '123',
        label: 'Mock Camera',
        kind: 'videoinput',
      });
    });
  });

  describe('CameraService - getAvailableCameraById', () => {
  
    it('hauria de retornar una càmera disponible segons el seu ID', () => {
      const mockDevices: MediaDeviceInfo[] = [
        { deviceId: '123', label: 'Camera 1', kind: 'videoinput', groupId: 'group1', toJSON: jest.fn() },
        { deviceId: '456', label: 'Camera 2', kind: 'videoinput', groupId: 'group2', toJSON: jest.fn() },
      ];
  
      cameraService.availableDevices$.set(mockDevices);
  
      const foundCamera = cameraService.getAvailableCameraById('456');
  
      expect(foundCamera).toEqual(mockDevices[1]);
    });
  
    it('hauria de retornar undefined si l’ID no existeix', () => {
      const mockDevices: MediaDeviceInfo[] = [
        { deviceId: '123', label: 'Camera 1', kind: 'videoinput', groupId: 'group1', toJSON: jest.fn() },
      ];
  
      cameraService.availableDevices$.set(mockDevices);
  
      const foundCamera = cameraService.getAvailableCameraById('999'); // ID inexistent
  
      expect(foundCamera).toBeUndefined();
    });
  });

  it('hauria de concedir permís de càmera i aturar els tracks si getUserMedia té èxit', async () => {
    const mockStream = new MediaStream();
    jest.spyOn(navigator.mediaDevices, 'getUserMedia').mockResolvedValue(mockStream);
    jest.spyOn(cameraService, 'stopMediaTracks').mockImplementation();

    const result = await cameraService.getCameraPermissionAndStopTracks();

    expect(result).toBe(true);
    expect(cameraService.stopMediaTracks).toHaveBeenCalledWith(mockStream);
  });

  it('hauria de llençar un error si getUserMedia falla', async () => {
    const error = new Error('Permission denied');
    jest.spyOn(navigator.mediaDevices, 'getUserMedia').mockRejectedValue(error);

    await expect(cameraService.getCameraPermissionAndStopTracks()).rejects.toThrow(error);
  });

  describe('updateAvailableDevices', ()=>{
    it('hauria d’actualitzar availableDevices$ amb els dispositius de tipus videoinput', async () => {
      const mockDevices: MediaDeviceInfo[] = [
        { deviceId: '123', label: 'Camera 1', kind: 'videoinput', groupId: 'group1', toJSON: jest.fn() },
        { deviceId: '456', label: 'Microphone', kind: 'audioinput', groupId: 'group2', toJSON: jest.fn() },
        { deviceId: '789', label: 'Camera 2', kind: 'videoinput', groupId: 'group3', toJSON: jest.fn() }
      ];
  
      jest.spyOn(navigator.mediaDevices, 'enumerateDevices').mockResolvedValue(mockDevices);
  
      const result = await cameraService.updateAvailableCameras();
  
      expect(result).toEqual([
        { deviceId: '123', label: 'Camera 1', kind: 'videoinput', groupId: 'group1', toJSON: expect.any(Function) },
        { deviceId: '789', label: 'Camera 2', kind: 'videoinput', groupId: 'group3', toJSON: expect.any(Function) }
      ]);
  
      expect(cameraService.availableDevices$()).toEqual(result);
    });
  
    it('hauria de retornar una llista buida si no hi ha càmeres disponibles', async () => {
      jest.spyOn(navigator.mediaDevices, 'enumerateDevices').mockResolvedValue([
        { deviceId: '456', label: 'Microphone', kind: 'audioinput', groupId: 'group2', toJSON: jest.fn() }
      ]);
  
      const result = await cameraService.updateAvailableCameras();
  
      expect(result).toEqual([]);
      expect(cameraService.availableDevices$()).toEqual([]);
    });
  });

  describe('getCameraFromStorage', ()=>{
    it('hauria de retornar la càmera seleccionada si està disponible', async () => {
      const mockCamera: MediaDeviceInfo = {
        deviceId: '123',
        label: 'Camera 1',
        kind: 'videoinput',
        groupId: 'group1',
        toJSON: jest.fn(),
      };
  
      jest.spyOn(cameraService, 'isCameraAvailableById').mockReturnValue(true);
      cameraService.selectedCamera$.set(mockCamera);
  
      const result = await cameraService.getCameraFromAvailables();
  
      expect(result).toBe(mockCamera);
    });
  
    it('hauria de retornar la càmera emmagatzemada si està disponible', async () => {
      const mockCameraFromStorage: MediaDeviceInfo = {
        deviceId: '456',
        label: 'Stored Camera',
        kind: 'videoinput',
        groupId: 'group2',
        toJSON: jest.fn(),
      };
  
      jest.spyOn(cameraService, 'isCameraAvailableById').mockReturnValue(true);
      jest.spyOn(cameraService, 'getCameraFromStorage').mockResolvedValue(mockCameraFromStorage);
  
      const result = await cameraService.getCameraFromAvailables();
  
      expect(result).toBe(mockCameraFromStorage);
      expect(cameraService.selectedCamera$()).toBe(mockCameraFromStorage);
    });
  
    it('hauria de retornar la càmera per defecte si no hi ha cap altra disponible', async () => {
      const mockDefaultCamera: MediaDeviceInfo = {
        deviceId: '789',
        label: 'Default Camera',
        kind: 'videoinput',
        groupId: 'group3',
        toJSON: jest.fn(),
      };
      cameraService.selectedCamera$ = signal(undefined);
  
      jest.spyOn(cameraService, 'isCameraAvailableById').mockReturnValueOnce(true);
      jest.spyOn(cameraService, 'getCameraFromStorage').mockResolvedValue(undefined);
      jest.spyOn(cameraService, 'getDefaultAvailableCamera').mockResolvedValue(mockDefaultCamera);
      jest.spyOn(cameraService, 'setCamera');
  
      const result = await cameraService.getCameraFromAvailables();
  
      expect(result).toBe(mockDefaultCamera);
      expect(cameraService.setCamera).toHaveBeenCalledWith(mockDefaultCamera);
    });
  
    it('hauria de retornar NO_CAMERA_AVAILABLE si no hi ha cap càmera disponible', async () => {
      jest.spyOn(cameraService, 'isCameraAvailableById').mockReturnValue(false);
      jest.spyOn(cameraService, 'getCameraFromStorage').mockResolvedValue(undefined);
      jest.spyOn(cameraService, 'getDefaultAvailableCamera').mockResolvedValue({} as MediaDeviceInfo);
  
      const result = await cameraService.getCameraFromAvailables();
  
      expect(result).toBe('NO_CAMERA_AVAILABLE');
    });
  
  });

  describe('getCameraFromStorage', ()=>{
    it('hauria de retornar la càmera emmagatzemada si és vàlida', async () => {
      const mockCamera: MediaDeviceInfo = {
        deviceId: '123',
        label: 'Stored Camera',
        kind: 'videoinput',
        groupId: 'group1',
        toJSON: jest.fn(),
      };
  
      jest.spyOn(mockStorageService, 'get').mockResolvedValue(mockCamera);
      jest.spyOn(cameraService, 'isValidMediaDeviceInfo').mockReturnValue(true);
  
      const result = await cameraService.getCameraFromStorage();
  
      expect(result).toEqual(mockCamera);
    });
  
    it('hauria de retornar undefined si la càmera emmagatzemada és null', async () => {
      jest.spyOn(mockStorageService, 'get').mockResolvedValue(null);
  
      const result = await cameraService.getCameraFromStorage();
  
      expect(result).toBeUndefined();
    });
  
    it('hauria de retornar undefined si la càmera emmagatzemada no és vàlida', async () => {
      const invalidCamera = { someProperty: 'invalidData' }; // Objecte que no és un MediaDeviceInfo
  
      jest.spyOn(mockStorageService, 'get').mockResolvedValue(invalidCamera);
      jest.spyOn(cameraService, 'isValidMediaDeviceInfo').mockReturnValue(false);
  
      const result = await cameraService.getCameraFromStorage();
  
      expect(result).toBeUndefined();
    });
  
  });

  describe('get default available camera', ()=>{
    it('hauria de retornar la càmera posterior si està disponible', async () => {
      const mockDevices: MediaDeviceInfo[] = [
        { deviceId: '123', label: 'Front Camera', kind: 'videoinput', groupId: 'group1', toJSON: jest.fn() },
        { deviceId: '456', label: 'Rear Camera', kind: 'videoinput', groupId: 'group2', toJSON: jest.fn() },
      ];
  
      cameraService.availableDevices$.set(mockDevices);
  
      const result = await cameraService.getDefaultAvailableCamera();
  
      expect(result).toEqual(mockDevices[1]); // La càmera amb "Rear Camera"
    });
  
    it('hauria de retornar la primera càmera disponible si no hi ha càmera posterior', async () => {
      const mockDevices: MediaDeviceInfo[] = [
        { deviceId: '123', label: 'Front Camera', kind: 'videoinput', groupId: 'group1', toJSON: jest.fn() },
        { deviceId: '456', label: 'Secondary Camera', kind: 'videoinput', groupId: 'group2', toJSON: jest.fn() },
      ];
  
      cameraService.availableDevices$.set(mockDevices);
  
      const result = await cameraService.getDefaultAvailableCamera();
  
      expect(result).toEqual(mockDevices[0]); // Ha de retornar la primera càmera disponible
    });
  
    it('hauria de retornar undefined si no hi ha càmeres disponibles', async () => {
      cameraService.availableDevices$.set([]);
  
      const result = await cameraService.getDefaultAvailableCamera();
  
      expect(result).toBeUndefined();
    });
  
  })

  describe('isCameraAvailableById', ()=>{
    it('hauria de retornar la càmera posterior si està disponible', async () => {
      const mockDevices: MediaDeviceInfo[] = [
        { deviceId: '123', label: 'Front Camera', kind: 'videoinput', groupId: 'group1', toJSON: jest.fn() },
        { deviceId: '456', label: 'Rear Camera', kind: 'videoinput', groupId: 'group2', toJSON: jest.fn() },
      ];
  
      cameraService.availableDevices$.set(mockDevices);
  
      const result = await cameraService.getDefaultAvailableCamera();
  
      expect(result).toEqual(mockDevices[1]); // La càmera amb "Rear Camera"
    });
  
    it('hauria de retornar la primera càmera disponible si no hi ha càmera posterior', async () => {
      const mockDevices: MediaDeviceInfo[] = [
        { deviceId: '123', label: 'Front Camera', kind: 'videoinput', groupId: 'group1', toJSON: jest.fn() },
        { deviceId: '456', label: 'Secondary Camera', kind: 'videoinput', groupId: 'group2', toJSON: jest.fn() },
      ];
  
      cameraService.availableDevices$.set(mockDevices);
  
      const result = await cameraService.getDefaultAvailableCamera();
  
      expect(result).toEqual(mockDevices[0]); // Ha de retornar la primera càmera disponible
    });
  
    it('hauria de retornar undefined si no hi ha càmeres disponibles', async () => {
      cameraService.availableDevices$.set([]);
  
      const result = await cameraService.getDefaultAvailableCamera();
  
      expect(result).toBeUndefined();
    });
  
  });

  describe('isValidMediaInfo', ()=>{
    it('hauria de retornar true per un objecte MediaDeviceInfo vàlid', () => {
      const validCamera: MediaDeviceInfo = {
        deviceId: '123',
        label: 'Valid Camera',
        kind: 'videoinput',
        groupId: 'group1',
        toJSON: jest.fn(),
      };
  
      expect(cameraService.isValidMediaDeviceInfo(validCamera)).toBe(true);
    });
  
    it('hauria de retornar false si falta la propietat deviceId', () => {
      const invalidCamera = {
        label: 'Invalid Camera',
        kind: 'videoinput',
        groupId: 'group1',
      };
  
      expect(cameraService.isValidMediaDeviceInfo(invalidCamera)).toBe(false);
    });
  
    it('hauria de retornar false si kind no és "videoinput"', () => {
      const invalidCamera: any = {
        deviceId: '123',
        label: 'Not a camera',
        kind: 'audioinput',
        groupId: 'group1',
      };
  
      expect(cameraService.isValidMediaDeviceInfo(invalidCamera)).toBe(false);
    });
  
    it('hauria de retornar false si l’objecte és null o undefined', () => {
      expect(cameraService.isValidMediaDeviceInfo(null)).toBe(false);
      expect(cameraService.isValidMediaDeviceInfo(undefined)).toBe(false);
    });
  
    it('hauria de retornar false si l’objecte no té la estructura correcta', () => {
      const randomObject = { someKey: 'someValue' };
      expect(cameraService.isValidMediaDeviceInfo(randomObject)).toBe(false);
    });
  
  });

  it('hauria de parar tots els tracks del MediaStream', () => {
    const mockTrack1 = { stop: jest.fn() };
    const mockTrack2 = { stop: jest.fn() };
    const mockStream = { getTracks: jest.fn(() => [mockTrack1, mockTrack2]) } as unknown as MediaStream;
  
    cameraService.stopMediaTracks(mockStream);
  
    expect(mockStream.getTracks).toHaveBeenCalled();
    expect(mockTrack1.stop).toHaveBeenCalled();
    expect(mockTrack2.stop).toHaveBeenCalled();
  });
  
  it('no hauria de llençar errors si el MediaStream no té tracks', () => {
    const mockStream = { getTracks: jest.fn(() => []) } as unknown as MediaStream;
  
    expect(() => cameraService.stopMediaTracks(mockStream)).not.toThrow();
    expect(mockStream.getTracks).toHaveBeenCalled();
  });
  
  describe('handle camera errors', ()=>{
    it('hauria de establir isCameraError$ a true i registrar un error amb CameraLogsService', async () => {
      const mockError = new Error('Camera permission denied');
      jest.spyOn(cameraService, 'alertCameraErrorsByErrorName');
      const mockAddCameraLog = jest.spyOn(cameraService['cameraLogsService'], 'addCameraLog');
    
      cameraService.handleCameraErrors(mockError, 'fetchError');
    
      expect(cameraService.isCameraError$()).toBe(true);
      expect(cameraService.alertCameraErrorsByErrorName).toHaveBeenCalledWith(mockError.name);
      expect(mockAddCameraLog).toHaveBeenCalledWith(mockError, 'fetchError');
    });
    
    it('hauria de manejar errors passats com a objectes amb un camp name', async () => {
      const mockError = { name: 'NotAllowedError' };
      jest.spyOn(cameraService, 'alertCameraErrorsByErrorName');
      const mockAddCameraLog = jest.spyOn(cameraService['cameraLogsService'], 'addCameraLog');
    
      cameraService.handleCameraErrors(mockError, 'fetchError');
    
      expect(cameraService.isCameraError$()).toBe(true);
      expect(cameraService.alertCameraErrorsByErrorName).toHaveBeenCalledWith(mockError.name);
      expect(mockAddCameraLog).toHaveBeenCalledWith(expect.any(Error), 'fetchError');
    });
    
    it('hauria de usar "undefinedError" si no es proporciona un tipus de log', async () => {
      const mockError = new Error('Unknown error');
      const mockAddCameraLog = jest.spyOn(cameraService['cameraLogsService'], 'addCameraLog');
    
      cameraService.handleCameraErrors(mockError);
    
      expect(mockAddCameraLog).toHaveBeenCalledWith(mockError, 'undefinedError');
    });
    
  });

  describe('check device and navigator version', ()=>{
    it('hauria de retornar true si la versió d’iOS és inferior al valor proporcionat', () => {
      jest.spyOn(navigator, 'userAgent', 'get').mockReturnValue('Mozilla/5.0 (iPhone; CPU iPhone OS 12_3 like Mac OS X)');
    
      expect(cameraService.isIOSVersionLowerThan(13)).toBe(true);
    });
    
    it('hauria de retornar false si la versió d’iOS és igual o superior al valor proporcionat', () => {
      jest.spyOn(navigator, 'userAgent', 'get').mockReturnValue('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)');
    
      expect(cameraService.isIOSVersionLowerThan(13)).toBe(false);
    });
    
    it('hauria de retornar false si no s’identifica cap versió d’iOS', () => {
      jest.spyOn(navigator, 'userAgent', 'get').mockReturnValue('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
    
      expect(cameraService.isIOSVersionLowerThan(13)).toBe(false);
    });
    
  });

  describe('should show error by label', ()=>{
    it('hauria de mostrar "errors.camera.not-readable" si l’error és NotReadableError', () => {
      cameraService.alertCameraErrorsByErrorName('NotReadableError: Could not start video source');
  
      expect(mockToastService.showErrorAlertByTranslateLabel).toHaveBeenCalledWith('errors.camera.not-readable');
    });
  
    it('hauria de mostrar "errors.camera.not-allowed" si l’error és NotAllowedError', () => {
      cameraService.alertCameraErrorsByErrorName('NotAllowedError: Permission denied');
  
      expect(mockToastService.showErrorAlertByTranslateLabel).toHaveBeenCalledWith('errors.camera.not-allowed');
    });
  
    it('hauria de mostrar "errors.camera.not-found" si l’error és NotFoundError', () => {
      cameraService.alertCameraErrorsByErrorName('NotFoundError: No camera found');
  
      expect(mockToastService.showErrorAlertByTranslateLabel).toHaveBeenCalledWith('errors.camera.not-found');
    });
  
    it('hauria de mostrar "errors.camera.not-found" si l’error és CustomNoAvailable', () => {
      cameraService.alertCameraErrorsByErrorName('CustomNoAvailable: No camera found');
  
      expect(mockToastService.showErrorAlertByTranslateLabel).toHaveBeenCalledWith('errors.camera.not-found');
    });
  
    it('hauria de mostrar "errors.camera.overconstrained" si l’error és OverconstrainedError', () => {
      cameraService.alertCameraErrorsByErrorName('OverconstrainedError: Camera constraints too strict');
  
      expect(mockToastService.showErrorAlertByTranslateLabel).toHaveBeenCalledWith('errors.camera.overconstrained');
    });
  
    it('hauria de mostrar "errors.camera.security" si l’error és SecurityError', () => {
      cameraService.alertCameraErrorsByErrorName('SecurityError: Blocked by browser');
  
      expect(mockToastService.showErrorAlertByTranslateLabel).toHaveBeenCalledWith('errors.camera.security');
    });
  
    it('hauria de mostrar "errors.camera.abort" si l’error és AbortError', () => {
      cameraService.alertCameraErrorsByErrorName('AbortError: The operation was aborted');
  
      expect(mockToastService.showErrorAlertByTranslateLabel).toHaveBeenCalledWith('errors.camera.abort');
    });
  
    it('hauria de mostrar "errors.camera.type" si l’error és TypeError', () => {
      cameraService.alertCameraErrorsByErrorName('TypeError: Invalid constraints');
  
      expect(mockToastService.showErrorAlertByTranslateLabel).toHaveBeenCalledWith('errors.camera.type');
    });
  
    it('hauria de mostrar "errors.camera.not-supported" si l’error és NotSupportedError', () => {
      cameraService.alertCameraErrorsByErrorName('NotSupportedError: The feature is not supported');
  
      expect(mockToastService.showErrorAlertByTranslateLabel).toHaveBeenCalledWith('errors.camera.not-supported');
    });
  
    it('hauria de mostrar "errors.camera.default" si l’error no coincideix amb cap cas conegut', () => {
      cameraService.alertCameraErrorsByErrorName('RandomError: Something unexpected happened');
  
      expect(mockToastService.showErrorAlertByTranslateLabel).toHaveBeenCalledWith('errors.camera.default');
    });
  });
  
  });


