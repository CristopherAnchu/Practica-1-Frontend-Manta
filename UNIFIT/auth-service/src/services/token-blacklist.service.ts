import { Injectable } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class TokenBlacklistService {
  private redisClient: RedisClientType;

  constructor() {
    this.redisClient = createClient({
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
      password: process.env.REDIS_PASSWORD || undefined,
    });

    this.redisClient.on('error', (err) => console.error('Redis Client Error', err));
    this.redisClient.connect();
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

    const ttl = decodedToken.exp - Math.floor(Date.now() / 1000);
    
    if (ttl > 0) {
      await this.redisClient.setEx(`blacklist:${token}`, ttl, 'revoked');
    }
  }

  /**
   * Verifica si un token está en la blacklist
   */
  async isBlacklisted(token: string): Promise<boolean> {
    const result = await this.redisClient.get(`blacklist:${token}`);
    return result !== null;
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
   * Limpia la conexión de Redis
   */
  async onModuleDestroy() {
    await this.redisClient.quit();
  }
}
