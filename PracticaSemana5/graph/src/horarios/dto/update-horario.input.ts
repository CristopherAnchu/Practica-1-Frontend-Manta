import { CreateHorarioInput } from './create-horario.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateHorarioInput extends PartialType(CreateHorarioInput) {
  @Field(() => Int)
  id: number;
}
