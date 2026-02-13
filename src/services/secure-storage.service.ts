import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class SecureStorageService {

  private secret = 'MI_CLAVE_SUPER_SECRETA';
  private canUseCrypto = window.isSecureContext && !!window.crypto?.subtle;

  async set(key: string, value: any) {
    const text = JSON.stringify(value);

    if (this.canUseCrypto) {
      const encrypted = await this.encrypt(text);
      localStorage.setItem(key, encrypted);
    } else {
      localStorage.setItem(key, btoa(text));
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const data = localStorage.getItem(key);
    if (!data) return null;

    if (this.canUseCrypto) {
      const decrypted = await this.decrypt(data);
      return JSON.parse(decrypted);
    } else {
      return JSON.parse(atob(data));
    }
  }

  remove(key: string) {
    localStorage.removeItem(key);
  }

  clear() {
    localStorage.clear();
  }

  // ===========================
  // ENCRIPTACIÓN (solo HTTPS)
  // ===========================

  private async encrypt(text: string): Promise<string> {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await this.getKey();

    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      new TextEncoder().encode(text)
    );

    return `${this.bufferToBase64(iv)}.${this.bufferToBase64(encrypted)}`;
  }

  private async decrypt(data: string): Promise<string> {
    const [ivBase64, encryptedBase64] = data.split('.');
    const iv = this.base64ToBuffer(ivBase64);
    const encrypted = this.base64ToBuffer(encryptedBase64);

    const key = await this.getKey();

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encrypted
    );

    return new TextDecoder().decode(decrypted);
  }

  private async getKey(): Promise<CryptoKey> {
    const keyMaterial = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(this.secret)
    );

    return crypto.subtle.importKey(
      'raw',
      keyMaterial,
      { name: 'AES-GCM' },
      false,
      ['encrypt', 'decrypt']
    );
  }

  private bufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
  }

  private base64ToBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    return bytes.buffer;
  }
}
