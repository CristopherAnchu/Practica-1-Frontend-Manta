import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsOptional, IsInt, Min } from 'class-validator';

@InputType()
export class CreateRutinaInput {
  @Field()
  @IsString()
  nombre: string;

  @Field()
  @IsString()
  descripcion: string;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  cupoMaximo: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  duracionMinutos?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  instructor?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  nivel?: string;
}

@InputType()
export class UpdateRutinaInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  nombre?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  cupoMaximo?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  duracionMinutos?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  instructor?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  nivel?: string;

  @Field({ nullable: true })
  @IsOptional()
  activa?: boolean;
}

@InputType()
export class RutinaFilterInput {
  @Field({ nullable: true })
  @IsOptional()
  nivel?: string;

  @Field({ nullable: true })
  @IsOptional()
  activa?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  instructor?: string;
}
