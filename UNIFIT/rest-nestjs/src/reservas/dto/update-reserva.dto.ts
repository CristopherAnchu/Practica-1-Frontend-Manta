import { PartialType } from '@nestjs/mapped-types';
import { CreateReservaDto } from './create-reserva.dto';
import { IsOptional, IsString, IsDateString } from 'class-validator';

export class UpdateReservaDto extends PartialType(CreateReservaDto) {
  @IsOptional()
  @IsDateString()
  fecha?: string;

  @IsOptional()
  @IsString()
  horaInicio?: string;

  @IsOptional()
  @IsString()
  horaFin?: string;

  @IsOptional()
  @IsString()
  tipoActividad?: string;

  @IsOptional()
  @IsString()
  estado?: string; // ejemplo: "pendiente" | "confirmada" | "cancelada"
}
