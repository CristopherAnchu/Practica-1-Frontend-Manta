import { PartialType } from '@nestjs/mapped-types';
import { CreateRolDto } from './create-rol.dto';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateRolDto extends PartialType(CreateRolDto) {
  @IsOptional()
  @IsString()
  @MinLength(3)
  nombre?: string;
}
