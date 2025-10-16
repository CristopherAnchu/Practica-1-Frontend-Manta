import { IsString } from "class-validator";


export class CreateUserDto {
    @IsString()
    name: string;
    @IsString()
    correo: string;
    @IsString()
    tipo: string;
}

