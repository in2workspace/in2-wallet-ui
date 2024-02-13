import { TestBed, waitForAsync } from '@angular/core/testing';
import { StorageService } from './storage.service';
import { Storage } from '@ionic/storage-angular';

describe('StorageService', () => {
  let storageService: StorageService;
  let storageMock: jasmine.SpyObj<Storage>;

  beforeEach(() => {
    const storageSpy = jasmine.createSpyObj('Storage', ['create', 'set', 'get', 'remove', 'length']);

    TestBed.configureTestingModule({
      providers: [
        { provide: Storage, useValue: storageSpy },
        StorageService,
      ],
    });

    storageService = TestBed.inject(StorageService);
    storageMock = TestBed.inject(Storage) as jasmine.SpyObj<Storage>;

    // Configuramos el mock para devolver valores predeterminados
    storageMock.create.and.returnValue(Promise.resolve(storageMock));
    storageMock.length.and.returnValue(Promise.resolve(0));
  });

  it('should be created', () => {
    expect(storageService).toBeTruthy();
  });

  
  it('should initialize storage', waitForAsync(() => {
    spyOn(storageService, 'init').and.callThrough();

    storageService.init().then(() => {
      expect(storageService.init).toHaveBeenCalled();
      expect(storageService['_storage']).toBeDefined();
    });
  }));



  it('should get a value from storage', waitForAsync(() => {
    const key = 'testKey';
    const value = 'testValue';

    storageMock.get.withArgs(key).and.returnValue(Promise.resolve(value));

    storageService.get(key).then((result) => {
      expect(result).toEqual(value);
    });
  }));


  
});
