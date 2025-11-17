import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateRolDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  nombre: string;
}
