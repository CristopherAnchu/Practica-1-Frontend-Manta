import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Reserva {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
