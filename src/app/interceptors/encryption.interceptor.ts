import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';

import {
  Injectable
} from '@angular/core';

import {
  Observable,
  from,
  throwError
} from 'rxjs';

import {
  catchError,
  mergeMap,
  switchMap
} from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CryptoService } from 'src/services/crypto.service';

@Injectable()
export class EncryptionInterceptor implements HttpInterceptor {

  /**
   * Endpoints que NO queremos cifrar.
   */
  private readonly excludedUrls = [
    '/swagger',
    '/swagger/index.html',
    '/health',
    '/testsocket',
    '/usuariosocket',
    '/proveedorsocket',
    '/notificationssocket',
  ];

  constructor(
    private readonly cryptoService: CryptoService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    if (environment.encryption == false) {
      return next.handle(req);
    }

    if (this.shouldSkip(req)) {
      return next.handle(req);
    }

    /**
     * Solo ciframos solicitudes que tengan body.
     *
     * GET normalmente no tiene body.
     */
    if (req.method === 'GET') {
      return this.handleGetRequest(req, next);
    }

    // HEAD
    if (req.method === 'HEAD') {
      return this.handleResponse(req, next);
    }

    // Si no tiene body
    if (!req.body) {
      return this.handleResponse(req, next);
    }

    if (req.body instanceof FormData) {
      return this.handleFormDataRequest(req, next);
    }

    /**
     * Convertimos y ciframos el body.
     */
    return from(
      this.cryptoService.encrypt(req.body)
    ).pipe(

      switchMap(encrypted => {

        const encryptedRequest =
          req.clone({
            body: encrypted,
            setHeaders: {
              'Content-Type': 'application/json'
            }
          });

        return this.handleResponse(
          encryptedRequest,
          next
        );
      })
    );
  }

  private handleResponse(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(

      mergeMap(async event => {

        // Respuestas HTTP exitosas
        if (event instanceof HttpResponse) {
          return await this.decryptResponse(event);
        }

        // Los demás eventos se dejan pasar
        return event;
      }),

      catchError((error: HttpErrorResponse) => {

        // Respuestas HTTP con errores (400, 401, 403, 500...)
        if (
          error.error &&
          typeof error.error === 'object' &&
          typeof error.error.Data === 'string'
        ) {

          return from(
            this.cryptoService.decrypt(error.error)
          ).pipe(
            mergeMap(decrypted => {

              const decryptedError = new HttpErrorResponse({
                error: decrypted,
                headers: error.headers,
                status: error.status,
                statusText: error.statusText,
                url: error.url ?? undefined
              });

              return throwError(() => decryptedError);
            })
          );
        }

        return throwError(() => error);
      })
    );
  }

  private async decryptResponse(
    event: HttpResponse<any>
  ): Promise<HttpResponse<any>> {

    if (
      !event.body ||
      typeof event.body !== 'object' ||
      typeof event.body.Data !== 'string'
    ) {
      return event;
    }

    const decrypted = await this.cryptoService.decrypt(event.body);

    return event.clone({
      body: decrypted
    });
  }

  private handleFormDataRequest(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    const formData = req.body as FormData;

    const fields: Record<string, string | string[]> = {};

    const files: Array<{
      key: string;
      file: File;
    }> = [];

    formData.forEach((value, key) => {

      if (value instanceof File) {

        files.push({
          key,
          file: value
        });

        return;
      }

      const current = fields[key];

      if (current === undefined) {

        fields[key] = value;

      } else if (Array.isArray(current)) {

        current.push(value);

      } else {

        fields[key] = [
          current,
          value
        ];
      }
    });

    return from(
      this.cryptoService.encrypt(fields)
    ).pipe(
      switchMap(encrypted => {

        const encryptedFormData =
          new FormData();

        encryptedFormData.append(
          'data',
          encrypted.Data
        );

        files.forEach(file => {

          encryptedFormData.append(
            file.key,
            file.file,
            file.file.name
          );

        });

        const encryptedRequest =
          req.clone({
            body: encryptedFormData
          });

        return this.handleResponse(
          encryptedRequest,
          next
        );
      })
    );
  }

  private handleGetRequest(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    // Si no tiene parámetros, no hay nada que cifrar
    if (!req.params || req.params.keys().length === 0) {
      return this.handleResponse(req, next);
    }

    const paramsObject: Record<string, string | string[]> = {};

    req.params.keys().forEach(key => {

      const values = req.params.getAll(key) ?? [];

      paramsObject[key] =
        values.length > 1
          ? values
          : values[0] ?? '';
    });

    return from(
      this.cryptoService.encrypt(paramsObject)
    ).pipe(
      switchMap(encrypted => {

        const encryptedParams = new HttpParams()
          .set('data', encrypted.Data);

        const encryptedRequest = req.clone({
          params: encryptedParams
        });

        return this.handleResponse(
          encryptedRequest,
          next
        );
      })
    );
  }

  private shouldSkip(
    req: HttpRequest<any>
  ): boolean {

    return this.excludedUrls.some(
      url => req.url.includes(url)
    );
  }
}
