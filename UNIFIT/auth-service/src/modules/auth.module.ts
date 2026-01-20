import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule } from '@nestjs/throttler';
import { User, RefreshToken } from '../entities/user.entity';
import { AuthService } from '../services/auth.service';
import { TokenBlacklistService } from '../services/token-blacklist.service';
import { AuthController } from '../controllers/auth.controller';
import { JwtStrategy } from '../strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RefreshToken]),
    PassportModule,
    JwtModule.register({}), // Configuración dinámica en el service
    ThrottlerModule.forRoot([{
      ttl: parseInt(process.env.RATE_LIMIT_TTL || '60') * 1000,
      limit: parseInt(process.env.RATE_LIMIT_MAX || '10'),
    }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenBlacklistService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
