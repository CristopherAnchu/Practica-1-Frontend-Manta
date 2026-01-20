import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  UseGuards, 
  Request,
  HttpCode,
  HttpStatus 
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AuthService } from '../services/auth.service';
import { RegisterDto, LoginDto, RefreshTokenDto, LogoutDto } from '../dto/auth.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthResponse, ValidateTokenResponse } from '../interfaces/auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * POST /auth/register
   * Registra un nuevo usuario
   */
  @Post('register')
  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponse> {
    return this.authService.register(registerDto);
  }

  /**
   * POST /auth/login
   * Inicia sesión
   */
  @Post('login')
  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(loginDto);
  }

  /**
   * POST /auth/refresh
   * Renueva el access token
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() refreshTokenDto: RefreshTokenDto): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.refreshTokens(refreshTokenDto.refreshToken);
  }

  /**
   * POST /auth/logout
   * Cierra sesión y revoca tokens
   */
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req, @Body() logoutDto: LogoutDto): Promise<{ message: string }> {
    await this.authService.logout(req.user.sub, logoutDto.refreshToken);
    
    // Agregar access token a blacklist
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      await this.authService.blacklistToken(token);
    }

    return { message: 'Sesión cerrada exitosamente' };
  }

  /**
   * GET /auth/me
   * Obtiene información del usuario autenticado
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Request() req): Promise<any> {
    return this.authService.getMe(req.user.sub);
  }

  /**
   * GET /auth/validate
   * Endpoint interno para validar tokens
   */
  @Get('validate')
  @UseGuards(JwtAuthGuard)
  async validate(@Request() req): Promise<ValidateTokenResponse> {
    return {
      valid: true,
      user: {
        id: req.user.sub,
        email: req.user.email,
        rol: req.user.rol,
        tipo: req.user.tipo,
      },
    };
  }
}
