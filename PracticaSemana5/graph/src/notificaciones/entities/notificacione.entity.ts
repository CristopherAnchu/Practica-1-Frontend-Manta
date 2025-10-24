import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Notificacione {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
