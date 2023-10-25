import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {  
    this.init(); 
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;  }

  public async set(llave:string, value: any) {
    await this._storage?.set(llave,value);
  }
  public async getAll(){
    let items:(string)[] = []
    let tamano= await this._storage?.length();
    for(let i= 0; i<(tamano?tamano:0);i++){

      let val = await this._storage?.get(i.toString())
      items.push((val!=null)?val:"");
  }
  return items;
  }
  public get(key:string): Promise<any>{
    return this.storage.get(key);
  }
  public remove(key:string){
    return this.storage.remove(key);
  }
}
