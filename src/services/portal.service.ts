import { Injectable } from '@angular/core';
import { TypeServicio } from 'src/app/enums/TypeUrl';
import { environment } from 'src/environments/environment';
import { HttpService } from './http.service';
import { Observable, of, tap } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PortalService {
  private _baseApiUrl = environment.server
  private login = TypeServicio.login
  private camposFiltro = TypeServicio.camposFiltro
  private colaboradores = TypeServicio.colaboradores
  private colaboradoresPag = TypeServicio.colaboradoresPag
  private colaboradoresInterventor = TypeServicio.colaboradoresInterventor
  private colaboradoresInterventorPag = TypeServicio.colaboradoresInterventorPag
  private CrearColaboradores = TypeServicio.crearColaboradores
  private crearColaboradoresInterv = TypeServicio.crearColaboradoresInterv
  private consultarColaboradores = TypeServicio.consultarColaboradores
  private consultarColaborador = TypeServicio.consultarColaborador
  private consultarColaboradorCedula = TypeServicio.consultarColaboradorCedula
  private getInfoColaborador = TypeServicio.getInfoColaborador
  private getInfoColaboradorIntenventor = TypeServicio.getInfoColaboradorIntenventor
  private getInfoColaboradorUsuario = TypeServicio.getInfoColaboradorUsuario
  private getGerencia = TypeServicio.getGerencias
  private getGetAreas = TypeServicio.getGetAreas
  private getGetCCO = TypeServicio.getGetCCO
  private generarReporteXlsx = TypeServicio.GenerarReporteXlsx
  private descargarAnexos= TypeServicio.descargarAnexos
  private ActualizarEstadoColaborador = TypeServicio.ActualizarEstadoColaborador
  private putInfoColaborador = TypeServicio.putInfoColaborador
  private putInfoColaboradorInterv = TypeServicio.putInfoColaboradorInterv
  private putCargoColaborador = TypeServicio.putCargoColaborador
  private putPerfilColaborador = TypeServicio.putPerfilColaborador
  private InactivarColaborador = TypeServicio.PutInactivarColaborador
  private ActivarColaborador = TypeServicio.PutActivarColaborador
  private InactivarColaboradorInterv = TypeServicio.PutInactivarColaboradorInterv
  private ActivarColaboradorInterv = TypeServicio.PutActivarColaboradorInterv
  private getUsuarios =TypeServicio.getUsuarios
  private getUsuariosPag =TypeServicio.getUsuariosPag
  private CrearUsuario =TypeServicio.CrearUsuario
  private GetUsuarioSistema =TypeServicio.GetInfoUsuario
  private ActualizarUsuario =TypeServicio.ActualizarUsuario
  private GetListarUsuariosAgregar = TypeServicio.GetListarUsuariosAgregar
  private ActualizarClave = TypeServicio.ActualizarClave
  private GetNombresFiltros = TypeServicio.GetNombresFiltros
  private GetNombresFiltroDet = TypeServicio.GetNombresFiltroDet
  private CrearFiltroDet = TypeServicio.CrearFiltroDet
  private ActualzarFiltroDet = TypeServicio.ActualzarFiltroDet
  private GetCamposEstado = TypeServicio.GetCamposEstado
  private AprobarRechazarColaborador = TypeServicio.AprobarRechazarColaborador
  private GetRolesUsuario = TypeServicio.GetRolesUsuario
  private GetAplicativos = TypeServicio.GetAplicativos
  private GetMenu = TypeServicio.GetMenu
  private colaborador = TypeServicio.colaborador
  private GetEmpresasFuncionario = TypeServicio.GetEmpresasFuncionario
  private GetTipoSolicitudesFuncionario = TypeServicio.GetTipoSolicitudesFuncionario
  private CrearTipoSolicitud = TypeServicio.CrearTipoSolicitud
  private UpdateTipoSolicitud = TypeServicio.UpdateTipoSolicitud
  private realizarSolicitud = TypeServicio.realizarSolicitud
  private obtenerMisSolicitudesPag = TypeServicio.obtenerMisSolicitudesPag
  private GetSolicitudInfoAdmin = TypeServicio.GetSolicitudInfoAdmin
  private UpdateSolicitud = TypeServicio.UpdateSolicitud
  private UpdateEstadoSolicitud = TypeServicio.UpdateEstadoSolicitud
  private GetIDColaboradoresPag = TypeServicio.GetIDColaboradoresPag

  constructor(private httpService: HttpService, private http: HttpClient) { }

  postLogin(data: any): Observable<any>{
    return this.httpService.PostCore(data,this.login);
  }

  getCaposFiltro(): Observable<any>{
    return this.httpService.GetCore(this.camposFiltro);
  }

  getNombresFiltros(): Observable<any>{
    return this.httpService.GetCore(this.GetNombresFiltros);
  }

  getNombresFiltrosDet(filtro:string): Observable<any>{
    const params = new HttpParams()
      .set('filtro', filtro)
    return this.httpService.GetParamsCore(this.GetNombresFiltroDet,params);
  }

  getMenu(rol:number): Observable<any>{
    const params = new HttpParams()
      .set('Rol', rol)
    return this.httpService.GetParamsCore(this.GetMenu,params);
  }

  getColaboradores(): Observable<any>{
    return this.httpService.GetCore(this.colaboradores);
  }
  getColaborador(): Observable<any>{
    return this.httpService.GetCore(this.colaborador);
  }

  getColaboradoresPag(pag:string): Observable<any>{
    const params = new HttpParams()
      .set('ServerSide', pag)
    return this.httpService.GetParamsCore(this.colaboradoresPag,params);
  }

  getColaboradoresInterventor(idRol:number): Observable<any>{
    const params = new HttpParams()
      .set('idRol', idRol)
    return this.httpService.GetParamsCore(this.colaboradoresInterventor,params);
  }

  getColaboradoresInterventorPag(pag:string): Observable<any>{
    const params = new HttpParams()
      .set('ServerSide', pag)
    return this.httpService.GetParamsCore(this.colaboradoresInterventorPag,params);
  }
  getIDColaboradoresPag(pag:string): Observable<any>{
    const params = new HttpParams()
      .set('ServerSide', pag)
    return this.httpService.GetParamsCore(this.GetIDColaboradoresPag,params);
  }

  getCamposEstado(estado:number,rol:number): Observable<any>{
    const params = new HttpParams()
      .set('estado', estado)
      .set('IdRol', rol)
    return this.httpService.GetParamsCore(this.GetCamposEstado,params);
  }

  getConsultatUsuarios(): Observable<any>{
    return this.httpService.GetCore(this.getUsuarios);
  }

  getConsultaUsuariosPag(pag:string): Observable<any>{
    const params = new HttpParams()
      .set('ServerSide', pag)
    return this.httpService.GetParamsCore(this.getUsuariosPag,params);
  }

  getListarUsuariosAgregar(): Observable<any>{
    return this.httpService.GetCore(this.GetListarUsuariosAgregar);
  }

  getConsultarColaboradores(): Observable<any>{
    return this.httpService.GetCore(this.consultarColaboradores);
  }

  getRolesUsuario(): Observable<any>{
    return this.httpService.GetCore(this.GetRolesUsuario);
  }

  getGetAplicativos(id?:number): Observable<any>{
    if (id){
      const params = new HttpParams()
        .set('id_aplicativo', id)
      return this.httpService.GetParamsCore(this.GetAplicativos,params);
    }else{
      return this.httpService.GetCore(this.GetAplicativos);
    }
  }

  getGenerarReporte(pag:string): Observable<any>{
    const params = new HttpParams()
        .set('ServerSide', pag)
    return this.httpService.GetFile(this.generarReporteXlsx,params);
  }

  getGerencias(idGerencia:number): Observable<any>{
    const params = new HttpParams()
      .set('id_ciudad', idGerencia)
    return this.httpService.GetParamsCore(this.getGerencia,params);
  }

  getAreas(idCiudad:number, idGerencia:number, ): Observable<any>{
    const params = new HttpParams()
      .set('id_ciudad', idCiudad)
      .set('gerencia', idGerencia)
    return this.httpService.GetParamsCore(this.getGetAreas,params);
  }

  getCCO(idCiudad:number, idGerencia:number, idArea:number): Observable<any>{
    const params = new HttpParams()
      .set('id_ciudad', idCiudad)
      .set('id_gerencia', idGerencia)
      .set('id_area', idArea)
    return this.httpService.GetParamsCore(this.getGetCCO,params);
  }

  getInfoColaboradores(idColaborador:number): Observable<any>{
    const params = new HttpParams()
      .set('id_colaborador', idColaborador)
    return this.httpService.GetParamsCore(this.getInfoColaborador,params);
  }

  getInfoColaboradoresInterventor(idColaborador:number): Observable<any>{
    const params = new HttpParams()
      .set('id_colaborador', idColaborador)
    return this.httpService.GetParamsCore(this.getInfoColaboradorIntenventor,params);
  }
  getInfoColaboradoresUsuario(): Observable<any>{
    return this.httpService.GetCore(this.getInfoColaboradorUsuario);
  }

  getEmpresasFuncionario(): Observable<any>{
    return this.httpService.GetCore(this.GetEmpresasFuncionario);
  }

  getTipoSolicitudesFuncionario(): Observable<any>{
    return this.httpService.GetCore(this.GetTipoSolicitudesFuncionario);
  }

  getConsultarColaboradorCedula(data: any): Observable<any>{
    const params = new HttpParams()
      .set('cedula', data.cedula)
    return this.httpService.GetParamsCore(this.consultarColaboradorCedula,params);
  }

  getUsuariosSistema(id:number): Observable<any>{
    return this.httpService.GetCore(this.GetUsuarioSistema);
  }

  getobtenerMisSolicitudesPag(pag:string): Observable<any>{
    const params = new HttpParams()
      .set('ServerSide', pag)
    return this.httpService.GetParamsCore(this.obtenerMisSolicitudesPag,params);
  }

  obtenerSolicitudPorId(id: number): Observable<any>{
    const params = new HttpParams()
      .set('id_solicitud', id)
    return this.httpService.GetParamsCore(this.GetSolicitudInfoAdmin,params);
  }

  descargarAnexo(id:number): Observable<any>{
    const params = new HttpParams()
        .set('id',id)
    return this.httpService.GetFile(this.descargarAnexos,params);
  }

  postCrearColaborador(data: any): Observable<any>{
    return this.httpService.PostFormDataCore(data,this.CrearColaboradores);
  }

  postCrearColaboradorInterventor(data: any): Observable<any>{
    return this.httpService.PostFormDataCore(data,this.crearColaboradoresInterv);
  }

  postRealizarSolicitud(data: any): Observable<any>{
    return this.httpService.PostFormDataCore(data,this.realizarSolicitud);
  }

  postConsultarColaborador(data: any): Observable<any>{
    return this.httpService.PostCore(data,this.consultarColaborador);
  }

  postActualizarEstadoColaborador(data: any): Observable<any>{
    return this.httpService.PostCore(data,this.ActualizarEstadoColaborador);
  }

  postCrearUsuario(data: any): Observable<any>{
    return this.httpService.PostCore(data,this.CrearUsuario);
  }

  postActualizarClave(data: any): Observable<any>{
    return this.httpService.PostCore(data,this.ActualizarClave);
  }

  postAprobarRechazarColaborador(data: any): Observable<any>{
    return this.httpService.PostCore(data,this.AprobarRechazarColaborador);
  }

  postCrearFiltroDet(data: any): Observable<any>{
    return this.httpService.PostCore(data,this.CrearFiltroDet);
  }

  postCrearSolicitud(data: any): Observable<any>{
    return this.httpService.PostCore(data,this.CrearTipoSolicitud);
  }

  postUpdateSolicitud(data: any): Observable<any>{
    return this.httpService.PostCore(data,this.UpdateTipoSolicitud);
  }

  putActualizarColaborador(data: any): Observable<any>{
    return this.httpService.PutFormDataCore(data,this.putInfoColaborador);
  }

  putActualizarColaboradorInterv(data: any): Observable<any>{
    return this.httpService.PutFormDataCore(data,this.putInfoColaboradorInterv);
  }

  putActualizarCargoColaborador(data: any): Observable<any>{
    return this.httpService.PutJsonCore(data,this.putCargoColaborador);
  }

  putActualizarPerfilColaborador(data: any): Observable<any>{
    return this.httpService.PutJsonCore(data,this.putPerfilColaborador);
  }

  putInactivarUsuario(data: any): Observable<any>{
    return this.httpService.PutJsonCore(data,this.InactivarColaborador);
  }

  putActivarColaborador(data: any): Observable<any>{
    return this.httpService.PutJsonCore(data,this.ActivarColaborador);
  }

  putInactivarUsuarioInterv(data: any): Observable<any>{
    return this.httpService.PutJsonCore(data,this.InactivarColaboradorInterv);
  }

  putActivarColaboradorInterv(data: any): Observable<any>{
    return this.httpService.PutJsonCore(data,this.ActivarColaboradorInterv);
  }

  putActualizarUsuario(data: any): Observable<any>{
    return this.httpService.PutJsonCore(data,this.ActualizarUsuario);
  }

  putActualzarFiltroDet(data: any): Observable<any>{
    return this.httpService.PutJsonCore(data,this.ActualzarFiltroDet);
  }

  putActualizarSolicitud(data: any): Observable<any>{
    return this.httpService.PutFormDataCore(data,this.UpdateSolicitud);
  }

  putActualizarEstadoSolicitud(data: any): Observable<any>{
    return this.httpService.PutJsonCore(data,this.UpdateEstadoSolicitud);
  }


}
