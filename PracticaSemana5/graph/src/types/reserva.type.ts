// ...existing code...
import { ObjectType, Field, ID, GraphQLISODateTime } from '@nestjs/graphql';
import { UserType } from './user.type';

@ObjectType()
export class ReservaType {
  @Field(() => ID)
  id: string;

  @Field(() => GraphQLISODateTime)
  fecha: Date;

  @Field()
  horaInicio: string;

  @Field()
  horaFin: string;

  @Field()
  tipoActividad: string;

  @Field()
  estado: string;

  @Field(() => UserType, { nullable: true })
  usuario?: UserType;
}
// ...existing code...