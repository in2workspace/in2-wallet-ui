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
    sessionStorage.clear();
  }

  // Create and expose methods that users of this service can
  // call, for example:
  public set( value: any) {
    sessionStorage.setItem(sessionStorage.length.toString(),value)
  }
  public getAll(){
    let items:(string)[] = []
    for(let i= 0; i<sessionStorage.length;i++){

      let val = sessionStorage.getItem(i.toString())
      items.push((val!=null)?val:"");
  }
  return items;
  }
  public get(key:string){
    return sessionStorage.getItem(key);
  }
}
