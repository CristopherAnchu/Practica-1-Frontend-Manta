import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RolService } from './rol.service';
import { Rol } from './entities/rol.entity';
import { CreateRolInput } from './dto/create-rol.input';
import { UpdateRolInput } from './dto/update-rol.input';

@Resolver(() => Rol)
export class RolResolver {
  constructor(private readonly rolService: RolService) {}

  @Mutation(() => Rol)
  createRol(@Args('createRolInput') createRolInput: CreateRolInput) {
    return this.rolService.create(createRolInput);
  }

  @Query(() => [Rol], { name: 'rol' })
  findAll() {
    return this.rolService.findAll();
  }

  @Query(() => Rol, { name: 'rol' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.rolService.findOne(id);
  }

  @Mutation(() => Rol)
  updateRol(@Args('updateRolInput') updateRolInput: UpdateRolInput) {
    return this.rolService.update(updateRolInput.id, updateRolInput);
  }

  @Mutation(() => Rol)
  removeRol(@Args('id', { type: () => Int }) id: number) {
    return this.rolService.remove(id);
  }
}
