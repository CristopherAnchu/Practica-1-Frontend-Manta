import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class HorarioType {
  @Field(() => ID)
  id: string;

  @Field()
  hora_inicio: string;

  @Field()
  hora_fin: string;

  @Field()
  dia_semana: string;

  @Field()
  estado: string;
}