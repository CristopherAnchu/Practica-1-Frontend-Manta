import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Rutina {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
