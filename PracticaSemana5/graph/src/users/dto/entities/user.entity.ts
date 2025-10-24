import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Rol } from '../../../rol/entities/rol.entity';

@ObjectType()
export class User {
  @Field(() => ID, { description: 'Example field (placeholder)' })
  id: string;

  @Field(() => String, { description: 'Example field (placeholder)' })
  name: string;

  @Field(() => String, { description: 'Example field (placeholder)' })
  email: string;

  @Field(() => Rol, { description: 'Example field (placeholder)' })
  rol: Rol;
}
