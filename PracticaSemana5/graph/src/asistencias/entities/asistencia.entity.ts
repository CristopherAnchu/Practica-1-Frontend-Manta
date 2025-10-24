import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Asistencia {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
