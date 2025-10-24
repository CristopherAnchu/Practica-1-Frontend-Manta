import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Rol {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
