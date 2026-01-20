import { Injectable, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export class TokenBlacklistService implements OnModuleDestroy {
  // En memoria en lugar de Redis para facilitar ejecución local sin dependencias
  private blacklist: Map<string, number> = new Map();

  constructor() {
    console.log('[TokenBlacklistService] Running in IN-MEMORY mode (Redis disabled)');
  }

  /**
   * Agrega un token a la blacklist
   */
  async addToBlacklist(token: string): Promise<void> {
    // Extraer tiempo de expiración del token
    const decodedToken = this.decodeToken(token);
    if (!decodedToken || !decodedToken.exp) {
      return;
    }

    // exp está en segundos, convertir a milisegundos
    const expirationTime = decodedToken.exp * 1000;
    
    // Solo agregar si no ha expirado
    if (expirationTime > Date.now()) {
      this.blacklist.set(token, expirationTime);
    }
  }

  /**
   * Verifica si un token está en la blacklist
   */
  async isBlacklisted(token: string): Promise<boolean> {
    const expirationTime = this.blacklist.get(token);
    
    // Si no está en el mapa, no está en blacklist
    if (!expirationTime) {
      return false;
    }

    // Si ya expiró, eliminar del mapa y retornar false
    if (Date.now() > expirationTime) {
      this.blacklist.delete(token);
      return false;
    }

    return true;
  }

  /**
   * Decodifica un JWT sin verificar (solo para extraer payload)
   */
  private decodeToken(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }
      const payload = Buffer.from(parts[1], 'base64').toString('utf-8');
      return JSON.parse(payload);
    } catch {
      return null;
    }
  }

  /**
   * Limpia recursos al destruir el módulo
   */
  async onModuleDestroy() {
    this.blacklist.clear();
  }
}
