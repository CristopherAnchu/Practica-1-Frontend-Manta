import { IsString } from "class-validator";

export class CreateIncidenciaDto {
    @IsString()
    descripcion: string;
    @IsString()
    estado: string;
    @IsString()
    usuarioId: string;
}
