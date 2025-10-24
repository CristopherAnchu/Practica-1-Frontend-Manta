import { CreateEquipoInput } from './create-equipo.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateEquipoInput extends PartialType(CreateEquipoInput) {
  @Field(() => Int)
  id: number;
}
