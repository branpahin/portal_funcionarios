import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CryptoService } from 'src/services/crypto.service';

@Injectable()
export class ClientIdInterceptor implements HttpInterceptor {

  private readonly storageKey = 'client_uuid';

  constructor(
    private readonly cryptoService: CryptoService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.validateCrypto();
    let clientId = localStorage.getItem(this.storageKey);

    if (!clientId) {
      clientId = crypto.randomUUID();
      localStorage.setItem(this.storageKey, clientId);
    }

    // Ciframos un objeto para que el backend pueda
    // recuperar el UUID como JSON.
    return from(
      this.cryptoService.encrypt({ clientId })
    ).pipe(
      switchMap(encrypted => {
        const encryptedRequest = req.clone({
          setHeaders: {
            'X-Client-Id': encrypted.Data
          }
        });

        return next.handle(encryptedRequest);
      })
    );
  }

  private validateCrypto(): void {
    if (!window.crypto?.subtle) {
      throw new Error(
        'Web Crypto API no está disponible. Se requiere HTTPS.'
      );
    }
  }
}