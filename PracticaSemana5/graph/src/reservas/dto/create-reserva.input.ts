import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateReservaInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
