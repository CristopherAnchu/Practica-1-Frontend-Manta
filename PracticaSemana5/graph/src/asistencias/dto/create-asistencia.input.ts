import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateAsistenciaInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
