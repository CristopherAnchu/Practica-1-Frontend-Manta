import { PartialType } from '@nestjs/mapped-types';
import { CreateRutinaDto } from './create-rutina.dto';
import { IsOptional, IsString, IsInt, Min, IsUUID } from 'class-validator';

export class UpdateRutinaDto extends PartialType(CreateRutinaDto) {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  duracionMinutos?: number;

  @IsOptional()
  @IsUUID()
  usuarioId?: string;
}
