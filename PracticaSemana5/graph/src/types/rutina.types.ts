import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { UserType } from './user.type';

@ObjectType()
export class RutinaType {
  @Field(() => ID)
  id: string;

  @Field()
  nombre: string;

  @Field({ nullable: true })
  descripcion?: string;

  @Field(() => Int, { nullable: true })
  duracionMinutos?: number;

  @Field(() => UserType, { nullable: true })
  usuario?: UserType;
}