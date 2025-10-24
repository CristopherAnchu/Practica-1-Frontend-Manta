import { CreateRutinaInput } from './create-rutina.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateRutinaInput extends PartialType(CreateRutinaInput) {
  @Field(() => Int)
  id: number;
}
