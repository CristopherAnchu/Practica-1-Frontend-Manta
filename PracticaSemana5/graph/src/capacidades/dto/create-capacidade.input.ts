import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateCapacidadeInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
