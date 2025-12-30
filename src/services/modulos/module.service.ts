import { Injectable } from '@angular/core';
import { SecureStorageService } from '../secure-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {
  private params:any
  private filtros:any
  constructor(private secureStorage: SecureStorageService) { }

  setParam(datos:any):void {
    this.params=datos
    this.secureStorage.set('params',datos)
  }
  async getParam(){
    if (!this.params) {
      this.params = await this.secureStorage.get<any>('params');
    }
    return this.params
  }

  setFiltros(datos:any):void {
    this.filtros=datos
    this.secureStorage.set('filtros',datos)
  }
  async getFiltros(){
    if (!this.filtros) {
      this.filtros = await this.secureStorage.get<any>('filtros');
    }
    return this.filtros
  }
}
