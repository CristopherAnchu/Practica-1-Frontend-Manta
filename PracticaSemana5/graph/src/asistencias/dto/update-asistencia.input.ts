import { CreateAsistenciaInput } from './create-asistencia.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateAsistenciaInput extends PartialType(CreateAsistenciaInput) {
  @Field(() => Int)
  id: number;
}
