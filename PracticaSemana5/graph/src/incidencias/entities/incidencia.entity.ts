import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Incidencia {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
