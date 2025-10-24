import { CreateNotificacioneInput } from './create-notificacione.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateNotificacioneInput extends PartialType(CreateNotificacioneInput) {
  @Field(() => Int)
  id: number;
}
