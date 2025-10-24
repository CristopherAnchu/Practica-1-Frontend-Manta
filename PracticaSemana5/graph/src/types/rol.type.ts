import { ObjectType, Field, ID } from '@nestjs/graphql';

import { UserType } from './user.type';

@ObjectType() // Hace que esta clase sea visible en el esquema GraphQL

export class Rol {
  @Field(() => ID) // Expone este campo como tipo ID en GraphQL
  
  id: string;

  @Field() // Expone el campo en el esquema GraphQL
  
  nombre: string;

  @Field(() => [UserType], { nullable: true }) // Relación con los usuarios
  
  users?: UserType[];
}