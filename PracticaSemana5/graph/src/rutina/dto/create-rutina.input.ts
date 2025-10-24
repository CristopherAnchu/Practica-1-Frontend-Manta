import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateRutinaInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
