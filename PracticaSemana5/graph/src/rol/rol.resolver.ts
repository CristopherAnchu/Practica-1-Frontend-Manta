// src/rol/rol.resolver.ts
import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { Rol } from '../types/rol.type';
import { RolRestService } from './rol.service';

@Resolver(() => Rol)
export class RolResolver {
  constructor(private rolService: RolRestService) {}

  @Query(() => [Rol], { name: 'roles' })
  async getRoles() {
    return this.rolService.findAll();
  }

  @Query(() => Rol, { name: 'rol' })
  async getRol(@Args('id', { type: () => Int }) id: number) {
    return this.rolService.findOne(id);
  }
}
