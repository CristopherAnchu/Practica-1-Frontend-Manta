import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateIncidenciaInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
