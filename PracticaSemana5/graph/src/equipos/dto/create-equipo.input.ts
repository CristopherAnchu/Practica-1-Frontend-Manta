import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateEquipoInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
