import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private _storage: Storage | null = null;

  public constructor(private storage: Storage) {
    this.init();
  }

  public async set(llave: string, value: unknown) {
    await this._storage?.set(llave, value);
  }

  public async getAll() {
    const items: string[] = [];
    const size = await this._storage?.length();
    for (let i = 0; i < (size || 0); i++) {
      const val = await this._storage?.get(i.toString());
      items.push(val ?? '');
    }
    //!
    console.log(items);
    return items;
  }

  public get(key: string): Promise<string> {
    return this.storage.get(key);
  }

  public remove(key: string) {
    return this.storage.remove(key);
  }

  private async init() {
    this._storage = await this.storage.create();
  }
}
