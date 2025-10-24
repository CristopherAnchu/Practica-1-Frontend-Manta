import { CreateIncidenciaInput } from './create-incidencia.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateIncidenciaInput extends PartialType(CreateIncidenciaInput) {
  @Field(() => Int)
  id: number;
}
