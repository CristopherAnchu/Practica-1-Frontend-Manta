import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class IncidenciaType {
  @Field(() => ID)
  id: string;

  @Field()
  descripcion: string;

  @Field()
  estado: string;
}