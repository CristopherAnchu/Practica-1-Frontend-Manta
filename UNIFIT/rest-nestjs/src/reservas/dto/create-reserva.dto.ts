import { IsNotEmpty, IsString, IsDateString, IsUUID } from 'class-validator';

export class CreateReservaDto {
  @IsNotEmpty()
  @IsDateString()
  fecha: string; 

  @IsNotEmpty()
  @IsString()
  horaInicio: string;

  @IsNotEmpty()
  @IsString()
  horaFin: string; 

  @IsNotEmpty()
  @IsString()
  tipoActividad: string; 

  @IsUUID()
  @IsNotEmpty()
  usuarioId: string; 
}
