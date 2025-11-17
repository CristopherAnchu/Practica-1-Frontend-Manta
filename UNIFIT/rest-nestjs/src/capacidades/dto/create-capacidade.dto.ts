import { IsString } from 'class-validator';

export class CreateCapacidadeDto {
    @IsString()
    id_horario: string;
    @IsString()
    fecha: string;
    @IsString()
    capacidad_maxima: string;
    @IsString()
    capacidad_minima: string;
}
