import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserRol, UserTipo } from '../entities/user.entity';
import { RefreshToken } from '../entities/refresh-token.entity';
import { RegisterDto, LoginDto } from '../dto/auth.dto';
import { JwtPayload, AuthResponse } from '../interfaces/auth.interface';
import { TokenBlacklistService } from './token-blacklist.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private jwtService: JwtService,
    private tokenBlacklistService: TokenBlacklistService,
  ) {}

  /**
   * Registra un nuevo usuario
   */
  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    // Verificar si el email ya existe
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Crear usuario
    const user = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
      rol: registerDto.tipo === 'ADMINISTRADOR' ? UserRol.ADMINISTRADOR : UserRol.USUARIO,
    });

    await this.userRepository.save(user);

    // Generar tokens
    const tokens = await this.generateTokens(user);

    // Guardar refresh token
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  /**
   * Login de usuario
   */
  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!user.activo) {
      throw new UnauthorizedException('Usuario desactivado');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar tokens
    const tokens = await this.generateTokens(user);

    // Guardar refresh token
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  /**
   * Renueva el access token usando el refresh token
   */
  async refreshTokens(oldRefreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      // Verificar el refresh token
      const payload = this.jwtService.verify(oldRefreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      // Buscar el refresh token en la BD
      const refreshTokenRecord = await this.refreshTokenRepository.findOne({
        where: { token: oldRefreshToken, userId: payload.sub },
      });

      if (!refreshTokenRecord || refreshTokenRecord.revoked) {
        throw new UnauthorizedException('Refresh token inválido o revocado');
      }

      // Verificar expiración
      if (new Date() > refreshTokenRecord.expiresAt) {
        throw new UnauthorizedException('Refresh token expirado');
      }

      // Obtener usuario
      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user || !user.activo) {
        throw new UnauthorizedException('Usuario no encontrado o desactivado');
      }

      // Revocar el refresh token antiguo
      refreshTokenRecord.revoked = true;
      await this.refreshTokenRepository.save(refreshTokenRecord);

      // Generar nuevos tokens
      const tokens = await this.generateTokens(user);

      // Guardar nuevo refresh token
      await this.saveRefreshToken(user.id, tokens.refreshToken);

      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido');
    }
  }

  /**
   * Logout - Revoca el refresh token
   */
  async logout(userId: string, refreshToken: string): Promise<void> {
    // Revocar refresh token
    await this.refreshTokenRepository.update(
      { token: refreshToken, userId },
      { revoked: true },
    );

    // Agregar access token a blacklist (si se proporciona)
    // Esto se maneja desde el controller
  }

  /**
   * Valida un access token
   */
  async validateToken(token: string): Promise<JwtPayload> {
    try {
      // Verificar si está en blacklist
      const isBlacklisted = await this.tokenBlacklistService.isBlacklisted(token);
      if (isBlacklisted) {
        throw new UnauthorizedException('Token revocado');
      }

      // Verificar firma y expiración
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });

      return payload;
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }

  /**
   * Obtiene información del usuario autenticado
   */
  async getMe(userId: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    return this.sanitizeUser(user);
  }

  /**
   * Genera access token y refresh token
   */
  private async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      rol: user.rol,
      tipo: user.tipo,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
    });

    return { accessToken, refreshToken };
  }

  /**
   * Guarda el refresh token en la base de datos
   */
  private async saveRefreshToken(userId: string, token: string): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 días

    const refreshToken = this.refreshTokenRepository.create({
      token,
      userId,
      expiresAt,
    });

    await this.refreshTokenRepository.save(refreshToken);
  }

  /**
   * Limpia datos sensibles del usuario
   */
  private sanitizeUser(user: User): any {
    const { password, ...sanitized } = user;
    return sanitized;
  }

  /**
   * Agrega token a blacklist
   */
  async blacklistToken(token: string): Promise<void> {
    await this.tokenBlacklistService.addToBlacklist(token);
  }
}
