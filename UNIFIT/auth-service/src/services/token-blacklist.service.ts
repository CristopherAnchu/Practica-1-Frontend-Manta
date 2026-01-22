import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { RevokedToken } from '../entities/revoked-token.entity';

@Injectable()
export class TokenBlacklistService {
  constructor(
    @InjectRepository(RevokedToken)
    private revokedRepo: Repository<RevokedToken>,
    private jwtService: JwtService,
  ) {}

  /**
   * Agrega un token a la blacklist persistente
   */
  async addToBlacklist(token: string): Promise<void> {
    const decoded: any = this.jwtService.decode(token);
    const expMs = decoded?.exp ? decoded.exp * 1000 : null;

    if (!expMs || expMs <= Date.now()) {
      return; // no almacenar tokens ya expirados o sin exp
    }

    await this.revokedRepo.upsert(
      {
        token,
        expiresAt: new Date(expMs),
      },
      ['token'],
    );

    await this.cleanExpired();
  }

  /**
   * Verifica si un token está revocado
   */
  async isBlacklisted(token: string): Promise<boolean> {
    await this.cleanExpired();
    const record = await this.revokedRepo.findOne({ where: { token } });
    return Boolean(record);
  }

  /**
   * Borra tokens expirados para mantener la tabla limpia
   */
  private async cleanExpired(): Promise<void> {
    await this.revokedRepo.delete({ expiresAt: LessThan(new Date()) });
  }
}
