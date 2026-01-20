import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { UserTipo } from '../entities/user.entity';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password: string;

  @IsString()
  nombre: string;

  @IsEnum(UserTipo)
  @IsOptional()
  tipo?: UserTipo;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class RefreshTokenDto {
  @IsString()
  refreshToken: string;
}

export class LogoutDto {
  @IsString()
  refreshToken: string;
}
