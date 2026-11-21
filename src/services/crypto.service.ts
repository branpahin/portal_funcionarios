import { Injectable } from '@angular/core';

export interface EncryptedRequest {
  Data: string;
}

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  /**
   * IMPORTANTE:
   * Esta misma clave debe existir en el backend.
   *
   * No utilices una clave corta.
   * Lo ideal es una cadena larga, aleatoria y difícil de adivinar.
   */
  private readonly secret = 'ycyaE1GjetHSYe8+zhjEpVXwkVB27v+qO2GWKpf4Dlc6lYPRVfhe7M0rySBF2kWq';

  private readonly encoder = new TextEncoder();
  private readonly decoder = new TextDecoder();

  private readonly canUseCrypto =
    typeof window !== 'undefined' &&
    !!window.crypto?.subtle;

  private keyPromise?: Promise<CryptoKey>;

  constructor() {}

  private validateCrypto(): void {
    if (!window.crypto?.subtle) {
      throw new Error(
        'Web Crypto API no está disponible. Se requiere HTTPS.'
      );
    }
  }

  /**
   * Cifra cualquier objeto/string.
   */
  async encrypt(data: unknown): Promise<EncryptedRequest> {
    this.validateCrypto();
    const text =
      typeof data === 'string'
        ? data
        : JSON.stringify(data);

    const iv = crypto.getRandomValues(new Uint8Array(12));

    const key = await this.getKey();

    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
        tagLength: 128
      },
      key,
      this.encoder.encode(text)
    );

    return {
      Data: `${this.bufferToBase64(iv)}.${this.bufferToBase64(encrypted)}`
    };
  }

  /**
   * Descifra una respuesta.
   */
  async decrypt<T>(encryptedData: string | EncryptedRequest): Promise<T> {
    this.validateCrypto();
    const value =
      typeof encryptedData === 'string'
        ? encryptedData
        : encryptedData.Data;

    const parts = value.split('.');

    if (parts.length !== 2) {
      throw new Error('Formato de datos cifrados inválido.');
    }

    const iv = new Uint8Array(
      this.base64ToBuffer(parts[0])
    );

    const encrypted = this.base64ToBuffer(parts[1]);

    const key = await this.getKey();

    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
        tagLength: 128
      },
      key,
      encrypted
    );

    const text = this.decoder.decode(decrypted);
    console.log(text)
    return JSON.parse(text) as T;
  }

  /**
   * Genera la llave AES-256 a partir del secreto.
   *
   * SHA-256 = 32 bytes = 256 bits
   */
  private async getKey(): Promise<CryptoKey> {

    if (!this.keyPromise) {

      this.keyPromise = crypto.subtle
        .digest(
          'SHA-256',
          this.encoder.encode(this.secret)
        )
        .then(keyMaterial =>
          crypto.subtle.importKey(
            'raw',
            keyMaterial,
            {
              name: 'AES-GCM'
            },
            false,
            [
              'encrypt',
              'decrypt'
            ]
          )
        );
    }

    return this.keyPromise;
  }

  private bufferToBase64(
    buffer: ArrayBuffer | Uint8Array
  ): string {

    const bytes =
      buffer instanceof Uint8Array
        ? buffer
        : new Uint8Array(buffer);

    let binary = '';

    const chunkSize = 8192;

    for (
      let i = 0;
      i < bytes.length;
      i += chunkSize
    ) {

      const chunk = bytes.subarray(
        i,
        i + chunkSize
      );

      binary += String.fromCharCode(
        ...Array.from(chunk)
      );
    }

    return btoa(binary);
  }

  private base64ToBuffer(
    base64: string
  ): ArrayBuffer {

    const binary = atob(base64);

    const bytes = new Uint8Array(
      binary.length
    );

    for (
      let i = 0;
      i < binary.length;
      i++
    ) {
      bytes[i] = binary.charCodeAt(i);
    }

    return bytes.buffer;
  }
}
