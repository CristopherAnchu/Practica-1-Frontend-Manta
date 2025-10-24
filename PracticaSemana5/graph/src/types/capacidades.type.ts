import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class CapacidadType {
  @Field(() => ID)
  id: string;

  @Field()
  id_horario: string;

  @Field()
  fecha: string;

  @Field()
  capacidad_maxima: string;

  @Field()
  capacidad_minima: string;
}