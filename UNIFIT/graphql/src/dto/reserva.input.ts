import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsOptional, IsDateString, IsInt, Min, Max } from 'class-validator';

@InputType()
export class CreateReservaInput {
  @Field()
  @IsDateString()
  fecha: string;

  @Field(() => Int)
  @IsInt()
  usuarioId: number;

  @Field(() => Int)
  @IsInt()
  rutinaId: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  observaciones?: string;
}

@InputType()
export class UpdateReservaInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  fecha?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  estado?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  observaciones?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  calificacion?: number;

  @Field({ nullable: true })
  @IsOptional()
  asistio?: boolean;
}

@InputType()
export class ReservaFilterInput {
  @Field({ nullable: true })
  @IsOptional()
  estado?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  usuarioId?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  rutinaId?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  fechaInicio?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  fechaFin?: string;

  @Field({ nullable: true })
  @IsOptional()
  asistio?: boolean;
}
