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
  private putInfoColaborador = TypeServicio.putInfoColaborador

  constructor(private httpService: HttpService, private http: HttpClient) { }

  postLogin(data: any): Observable<any>{
    return this.httpService.PostCore(data,this.login);
  }

  getCaposFiltro(): Observable<any>{
    return this.httpService.GetParamsCore(this.camposFiltro);
  }

  getColaboradores(estado:number, ciudad:number): Observable<any>{
    return this.httpService.GetParamsCore(this.colaboradores+"?estados="+estado+"&ciudad="+ciudad);
  }

  getInfoColaboradores(idColaborador:number): Observable<any>{
    return this.httpService.GetParamsCore(this.getInfoColaborador+"?id_colaborador="+idColaborador);
  }

  getConsultarColaboradores(): Observable<any>{
    return this.httpService.GetCore(this.consultarColaboradores);
  }

  postCrearColaborador(data: any): Observable<any>{
    return this.httpService.PostFormDataCore(data,this.CrearColaboradores);
  }

  postConsultarColaborador(data: any): Observable<any>{
    return this.httpService.PostCore(data,this.consultarColaborador);
  }

  putActualizarColaborador(data: any): Observable<any>{
    return this.httpService.PutFormDataCore(data,this.putInfoColaborador);
  }

}
