import { CreateRolInput } from './create-rol.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateRolInput extends PartialType(CreateRolInput) {
  @Field(() => Int)
  id: number;
}
