import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsOptional, IsArray } from 'class-validator';

@InputType()
export class CreateRolInput {
  @Field()
  @IsString()
  nombre: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  permisos?: string[];
}

@InputType()
export class UpdateRolInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  nombre?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  permisos?: string[];
}
