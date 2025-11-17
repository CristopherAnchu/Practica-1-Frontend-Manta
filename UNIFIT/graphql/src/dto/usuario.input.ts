import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';

@InputType()
export class CreateUsuarioInput {
  @Field()
  @IsString()
  @MinLength(3)
  nombre: string;

  @Field()
  @IsEmail()
  correo: string;

  @Field()
  @IsString()
  tipo: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  telefono?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  cedula?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  rolId?: number;
}

@InputType()
export class UpdateUsuarioInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  nombre?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  correo?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  tipo?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  telefono?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  cedula?: string;

  @Field({ nullable: true })
  @IsOptional()
  activo?: boolean;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  rolId?: number;
}

@InputType()
export class UsuarioFilterInput {
  @Field({ nullable: true })
  @IsOptional()
  tipo?: string;

  @Field({ nullable: true })
  @IsOptional()
  activo?: boolean;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  rolId?: number;
}
