import { IsString } from "class-validator";

export class CreateEquipoDto {
    @IsString()
    nombre: string;
    @IsString()
    descripcion: string;
    @IsString()
    tipo: string;   
}
