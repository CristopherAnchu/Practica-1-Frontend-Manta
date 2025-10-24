import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateRolInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
