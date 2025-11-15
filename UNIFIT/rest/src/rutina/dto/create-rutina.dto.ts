import { IsNotEmpty, IsOptional, IsString, IsInt, IsUUID, Min } from 'class-validator';

export class CreateRutinaDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  duracionMinutos?: number;

  @IsNotEmpty()
  @IsUUID()
  usuarioId: string;
}
