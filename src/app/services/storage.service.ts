import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {   
  }

  async init() {
    localStorage.clear();
  }

  // Create and expose methods that users of this service can
  // call, for example:
  public set( value: any) {
    localStorage.setItem(localStorage.length.toString(),value)
  }
  public setLlave(llave:string, value: any) {
    localStorage.setItem(llave,value)
  }
  public getAll(){
    let items:(string)[] = []
    for(let i= 0; i<localStorage.length;i++){

      let val = localStorage.getItem(i.toString())
      items.push((val!=null)?val:"");
  }
  return items;
  }
  public get(key:string){
    return localStorage.getItem(key);
  }
}
