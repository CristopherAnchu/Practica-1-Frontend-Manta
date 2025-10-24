import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ReservaType } from './reserva.type';

@ObjectType()
export class UserType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

    @Field(() => [ReservaType], { nullable: 'itemsAndList' })
    reservas?: ReservaType[];
}