import { ObjectType, Field, ID } from '@nestjs/graphql';


@ObjectType() // Decorador GraphQL: define el tipo de objeto en el esquema

export class Equipo {
  @Field(() => ID) // Campo expuesto en GraphQL
  
  id: string;

  @Field() // Campo expuesto
  nombre: string;

  @Field()
  descripcion: string;

  @Field()
  tipo: string;
}