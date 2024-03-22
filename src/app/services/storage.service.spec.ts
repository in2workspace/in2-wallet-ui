import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { StorageService } from './storage.service';
import { Storage } from '@ionic/storage-angular';

describe('StorageService', () => {
  let service: StorageService;
  let storageSpy: jasmine.SpyObj<Storage>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('Storage', ['create', 'get', 'set', 'remove', 'length', 'keys']);
    TestBed.configureTestingModule({
      providers: [
        StorageService,
        { provide: Storage, useValue: spy }
      ]
    });
    service = TestBed.inject(StorageService);
    storageSpy = TestBed.inject(Storage) as jasmine.SpyObj<Storage>;
    storageSpy.create.and.resolveTo(spy as any);
    (service as any)._storage = spy;
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set a value in storage', fakeAsync(() => {
    const key = 'testKey';
    const value = 'testValue';
    storageSpy.set.and.returnValue(Promise.resolve());

    service.set(key, value);
    tick();

    expect(storageSpy.set.calls.count()).toBe(1);
    expect(storageSpy.set.calls.mostRecent().args).toEqual([key, value]);
  }));

  it('should get a value from storage', async () => {
    const key = 'testKey';
    const value = 'testValue';
    storageSpy.get.and.returnValue(Promise.resolve(value));

    const result = await service.get(key);
    expect(result).toEqual(value);
    expect(storageSpy.get).toHaveBeenCalledWith(key);
  });

  it('should get all values from storage', async () => {

    const expectedValues = ['', ''];
    storageSpy.length.and.returnValue(Promise.resolve(expectedValues.length));

    expectedValues.forEach((value, index) => {
      storageSpy.get.withArgs(index.toString()).and.returnValue(Promise.resolve(value));
    });

    const result = await service.getAll();

    expect(result.length).toEqual(expectedValues.length);
    expect(result).toEqual(expectedValues);
  });

  it('should remove a value from storage', async () => {
    const key = 'testKey';
    storageSpy.remove.and.returnValue(Promise.resolve());

    await service.remove(key);
    expect(storageSpy.remove).toHaveBeenCalledWith(key);
  });
});
