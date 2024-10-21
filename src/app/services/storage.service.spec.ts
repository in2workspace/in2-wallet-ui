import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { StorageService } from './storage.service';
import { Storage } from '@ionic/storage-angular';

describe('StorageService', () => {
  let service: StorageService;
  let ionicStorageSpy: jest.Mocked<any>;
  let ionicStorageServiceSpy: jest.Mocked<any>;

  beforeEach(fakeAsync(() => {
    ionicStorageSpy = {
      create: jest.fn(),
      get: jest.fn(),
      set: jest.fn(),
      remove: jest.fn(),
      length: jest.fn(),
      keys: jest.fn(),
    };

    ionicStorageServiceSpy = {
      create: () => ionicStorageSpy,
    };

    TestBed.configureTestingModule({
      providers: [
        StorageService,
        { provide: Storage, useValue: ionicStorageServiceSpy },
      ],
    });

    service = TestBed.inject(StorageService);
    (service as any).init();
    tick();
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set a value in storage', fakeAsync(() => {
    const key = 'testKey';
    const value = 'testValue';
    ionicStorageSpy.set.mockResolvedValue(Promise.resolve());

    service.set(key, value);
    tick();

    expect(ionicStorageSpy.set).toHaveBeenCalledTimes(1);
    expect(ionicStorageSpy.set).toHaveBeenCalledWith(key, value);
  }));

  it('should get a value from storage', async () => {
    const key = 'testKey';
    const value = 'testValue';
    ionicStorageSpy.get.mockResolvedValue(Promise.resolve(value));

    const result = await service.get(key);
    expect(result).toEqual(value);
    expect(ionicStorageSpy.get).toHaveBeenCalledWith(key);
  });

  it('should get all values from storage', async () => {
    const expectedValues = ['', ''];
    ionicStorageSpy.length.mockResolvedValue(Promise.resolve(expectedValues.length));

    expectedValues.forEach((value, index) => {
      ionicStorageSpy.get.mockResolvedValueOnce(value);
    });

    const result = await service.getAll();

    expect(result.length).toEqual(expectedValues.length);
    expect(result).toEqual(expectedValues);
  });

  it('should remove a value from storage', async () => {
    const key = 'testKey';
    ionicStorageSpy.remove.mockResolvedValue(Promise.resolve());

    await service.remove(key);
    expect(ionicStorageSpy.remove).toHaveBeenCalledWith(key);
  });
});
