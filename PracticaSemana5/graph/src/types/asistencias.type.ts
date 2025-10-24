
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class AsistenciaType {
  @Field(() => ID)
  id: string;

  @Field()
  id_reserva: string;

  @Field()
  hora_entrada: string;

  @Field()
  hora_salida: string;

  @Field()
  estado: string;
}

