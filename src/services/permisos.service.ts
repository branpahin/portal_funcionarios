import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {
  private permisos: any = {};

  constructor() { }

  setPermisos(permisos: any) {
    this.permisos = permisos;
    console.log("permisos: ",this.permisos)
  }

  getPermisos(): any {
    // Primero intenta desde memoria
    if (this.permisos && Object.keys(this.permisos).length > 0) {
      return this.permisos;
    }

    // Si no hay en memoria, intenta desde localStorage
    const permisosLS = localStorage.getItem('permisos');
    if (permisosLS) {
      this.permisos = JSON.parse(permisosLS);
      return this.permisos;
    }

    return {};
  }

  puedeConsultar(): boolean {
    return this.permisos.consultar === '1';
  }

  puedeGrabar(): boolean {
    return this.permisos.grabar === '0';
  }

  puedeEditar(): boolean {
    return this.permisos.editar === '0';
  }

  puedeBorrar(): boolean {
    return this.permisos.borrar === '0';
  }
}
