import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    // fixme: this.router.navigate() needs then().
    this.init();
  }

  async init() {
    this._storage = await this.storage.create();
  }

  public async set(llave: string, value: any) {
    await this._storage?.set(llave, value);
  }

  public async getAll() {
    let items: (string)[] = []
    let size = await this._storage?.length();
    for (let i = 0; i < (size || 0); i++) {
      let val = await this._storage?.get(i.toString())
      items.push(val ?? "");
    }
    return items;
  }

  public get(key: string): Promise<any> {
    return this.storage.get(key);
  }

  public remove(key: string) {
    return this.storage.remove(key);
  }

}
