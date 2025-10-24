// src/users/users.resolver.ts
import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { UserType } from '../types/user.type';
import { UsersRestService } from './users.service';

@Resolver(() => UserType)
export class UsersResolver {
  constructor(private usersService: UsersRestService) {}

  @Query(() => [UserType], { name: 'users' })
  async getUsers() {
    return this.usersService.findAll();
  }

  @Query(() => UserType, { name: 'user' })
  async getUser(@Args('id', { type: () => Int }) id: string) {
    return this.usersService.findOne(id);
  }
}
