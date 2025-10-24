import { CreateCapacidadeInput } from './create-capacidade.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCapacidadeInput extends PartialType(CreateCapacidadeInput) {
  @Field(() => Int)
  id: number;
}
