import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Capacidade {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
