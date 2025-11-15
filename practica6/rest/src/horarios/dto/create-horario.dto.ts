import { IsString } from 'class-validator';

export class CreateHorarioDto {
    @IsString()
    hora_inicio: string;
    @IsString()
    hora_fin: string;
    @IsString()
    dia_semana: string;
    @IsString()
    estado: string;
}
