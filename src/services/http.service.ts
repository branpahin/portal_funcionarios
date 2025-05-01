import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Component, Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

@Component({
	selector: 'app-login',
	templateUrl: './login.page.html',
	styleUrls: ['./login.page.scss'],
	standalone: true,
	
  })
export class HttpService {
  private _baseApiUrl = environment.server
  private token = localStorage.getItem('token');

  private getHttpOptions() {
    const token = localStorage.getItem('token'); // 🔹 Asegurar que siempre se obtiene el token actualizado

    if (!token) {
      console.error("⚠️ No se encontró un token en localStorage");
    }

    return {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '' // 🔹 Solo agrega el token si existe
      })
    };
  }
  
  httpOptions = {
		headers: new HttpHeaders({
			Accept: 'application/json',
			'Content-Type': 'application/json',
		 	Authorization: `Bearer ${this.token}`
		}),
	}
  
  constructor(private http: HttpClient) { }

	PostCore(body: any, rutaApi: string): Observable<HttpResponse<any>> {
		const APIREST = `${this._baseApiUrl}${rutaApi}`;
	
		return this.http.post<any>(APIREST, JSON.stringify(body), {
		...this.httpOptions,
		observe: 'response'
		});
	}

	PostFormDataCore(body: FormData, rutaApi: string): Observable<any> {
		const APIREST = `${this._baseApiUrl}${rutaApi}`;
		const headers = new HttpHeaders({
			Authorization: `Bearer ${this.token}`
		});
		return this.http.post<any>(APIREST, body, {
			headers,
			observe: 'response' 
		});
	}

	GetCore(rutaApi: string, alternativeUrl = false): Observable<any> {
		const APIREST = alternativeUrl ? rutaApi : `${this._baseApiUrl}${rutaApi}`
		return this.http.get<any>(APIREST, this.httpOptions).pipe(tap((resp) => {of(resp)}))
	}

	GetParamsCore(rutaApi: string): Observable<any> {
		const APIREST = `${this._baseApiUrl}${rutaApi}`
		console.log("📡 Enviando petición GET con headers:", this.getHttpOptions());
		return this.http.get<any>(APIREST, this.getHttpOptions()).pipe(tap((resp) => {of(resp)}))
	}

	PutFormDataCore(body: FormData, rutaApi: string): Observable<any> {
		const APIREST = `${this._baseApiUrl}${rutaApi}`
		const headers = new HttpHeaders({
			Authorization: `Bearer ${this.token}`
		});
		return this.http.put<any>(APIREST, body, {
			headers,
			observe: 'response' 
		});
	}
}
