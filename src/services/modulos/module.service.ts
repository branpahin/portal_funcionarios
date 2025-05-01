import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {
  private params:any
  private filtros:any
  constructor() { }

  setParam(datos:any):void {
    this.params=datos
    localStorage.setItem('params', JSON.stringify(datos));
  }
  getParam(){
    if (!this.params) {
      const storedData = localStorage.getItem('params');
      this.params = storedData ? JSON.parse(storedData) : null;
    }
    return this.params
  }

  setFiltros(datos:any):void {
    this.filtros=datos
    localStorage.setItem('filtros', JSON.stringify(datos));
  }
  getFiltros(){
    if (!this.filtros) {
      const storedData = localStorage.getItem('filtros');
      this.filtros = storedData ? JSON.parse(storedData) : null;
    }
    return this.filtros
  }
}
