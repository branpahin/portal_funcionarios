import { Injectable } from '@angular/core';
import { TypeServicio } from 'src/app/enums/TypeUrl';
import { environment } from 'src/environments/environment';
import { HttpService } from './http.service';
import { Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PortalService {
  private _baseApiUrl = environment.server
  private login = TypeServicio.login
  private camposFiltro = TypeServicio.camposFiltro
  private colaboradores = TypeServicio.colaboradores
  private CrearColaboradores = TypeServicio.crearColaboradores
  private consultarColaboradores = TypeServicio.consultarColaboradores
  private consultarColaborador = TypeServicio.consultarColaborador
  private getInfoColaborador = TypeServicio.getInfoColaborador
  private ActualizarEstadoColaborador = TypeServicio.ActualizarEstadoColaborador
  private putInfoColaborador = TypeServicio.putInfoColaborador
  private InactivarColaborador = TypeServicio.PutInactivarColaborador
  private getUsuarios =TypeServicio.getUsuarios
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

  constructor(private httpService: HttpService, private http: HttpClient) { }

  postLogin(data: any): Observable<any>{
    return this.httpService.PostCore(data,this.login);
  }

  getCaposFiltro(): Observable<any>{
    return this.httpService.GetParamsCore(this.camposFiltro);
  }

  getNombresFiltros(): Observable<any>{
    return this.httpService.GetParamsCore(this.GetNombresFiltros);
  }

  getNombresFiltrosDet(filtro:string): Observable<any>{
    return this.httpService.GetParamsCore(this.GetNombresFiltroDet+"?filtro="+filtro);
  }

  getColaboradores(estado:number, ciudad:number): Observable<any>{
    return this.httpService.GetParamsCore(this.colaboradores);
  }

  getCamposEstado(estado:number): Observable<any>{
    return this.httpService.GetParamsCore(this.GetCamposEstado+"?estado="+estado);
  }

  getConsultatUsuarios(): Observable<any>{
    return this.httpService.GetParamsCore(this.getUsuarios);
  }

  getListarUsuariosAgregar(): Observable<any>{
    return this.httpService.GetParamsCore(this.GetListarUsuariosAgregar);
  }

  getConsultarColaboradores(): Observable<any>{
    return this.httpService.GetCore(this.consultarColaboradores);
  }

  getRolesUsuario(): Observable<any>{
    return this.httpService.GetCore(this.GetRolesUsuario);
  }

  getGetAplicativos(): Observable<any>{
    return this.httpService.GetCore(this.GetAplicativos);
  }

  getInfoColaboradores(idColaborador:number): Observable<any>{
    return this.httpService.GetParamsCore(this.getInfoColaborador+"?id_colaborador="+idColaborador);
  }

  getUsuariosSistema(id:number): Observable<any>{
    return this.httpService.GetParamsCore(this.GetUsuarioSistema);
  }

  postCrearColaborador(data: any): Observable<any>{
    return this.httpService.PostFormDataCore(data,this.CrearColaboradores);
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

  putActualizarColaborador(data: any): Observable<any>{
    return this.httpService.PutFormDataCore(data,this.putInfoColaborador);
  }

  putInactivarUsuario(data: any): Observable<any>{
    return this.httpService.PutJsonCore(data,this.InactivarColaborador);
  }

  putActualizarUsuario(data: any): Observable<any>{
    return this.httpService.PutJsonCore(data,this.ActualizarUsuario);
  }

  putActualzarFiltroDet(data: any): Observable<any>{
    return this.httpService.PutJsonCore(data,this.ActualzarFiltroDet);
  }


}
