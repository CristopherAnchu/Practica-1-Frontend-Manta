import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/auth.interface';
import { TokenBlacklistService } from '../services/token-blacklist.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private tokenBlacklistService: TokenBlacklistService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET || 'your-super-secret-access-key-change-in-production',
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: JwtPayload): Promise<JwtPayload> {
    // Extraer token del header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (token) {
      // Verificar si está en blacklist
      const isBlacklisted = await this.tokenBlacklistService.isBlacklisted(token);
      if (isBlacklisted) {
        throw new UnauthorizedException('Token revocado');
      }
    }

    return payload;
  }
}
