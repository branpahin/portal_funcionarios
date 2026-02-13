import { Injectable } from '@angular/core';
import { SecureStorageService } from './secure-storage.service';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {
  private permisos: any = {};

  constructor(private secureStorage: SecureStorageService) { }

  setPermisos(permisos: any) {
    this.permisos = permisos;
    //console.log("permisos: ",this.permisos)
  }

  async getPermisos(): Promise<any> {
    // Primero intenta desde memoria
    if (this.permisos && Object.keys(this.permisos).length > 0) {
      return this.permisos;
    }

    // Si no hay en memoria, intenta desde localStorage
    const permisosLS = await this.secureStorage.get<string>('permisos');
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
    return this.permisos.grabar === '1';
  }

  puedeEditar(): boolean {
    return this.permisos.editar === '1';
  }

  puedeBorrar(): boolean {
    return this.permisos.borrar === '1';
  }
}
