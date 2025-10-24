import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class NotificationType {
  @Field(() => ID)
  id: string;

  @Field()
  message: string;

  @Field()
  userId: string;
}