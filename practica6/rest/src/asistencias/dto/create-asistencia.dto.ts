import { IsString } from 'class-validator';

export class CreateAsistenciaDto {
    @IsString()
    id_reserva: string;
    @IsString()
    hora_entrada: string;
    @IsString()
    hora_salida: string;
    @IsString()
    estado: string;
}
