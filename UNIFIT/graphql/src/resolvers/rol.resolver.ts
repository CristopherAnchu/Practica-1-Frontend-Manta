import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RolService } from '../services/rol.service';
import { Rol } from '../entities/rol.entity';
import { CreateRolInput, UpdateRolInput } from '../dto/rol.input';

@Resolver(() => Rol)
export class RolResolver {
  constructor(private readonly rolService: RolService) {}

  // Queries

  @Query(() => [Rol], { 
    name: 'roles',
    description: 'Obtiene todos los roles' 
  })
  async getRoles(): Promise<Rol[]> {
    return this.rolService.findAll();
  }

  @Query(() => Rol, { 
    name: 'rol',
    description: 'Obtiene un rol por su ID' 
  })
  async getRol(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Rol> {
    return this.rolService.findOne(id);
  }

  // Mutations

  @Mutation(() => Rol, {
    name: 'crearRol',
    description: 'Crea un nuevo rol'
  })
  async crearRol(
    @Args('input') createRolInput: CreateRolInput,
  ): Promise<Rol> {
    return this.rolService.create(createRolInput);
  }

  @Mutation(() => Rol, {
    name: 'actualizarRol',
    description: 'Actualiza un rol existente'
  })
  async actualizarRol(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') updateRolInput: UpdateRolInput,
  ): Promise<Rol> {
    return this.rolService.update(id, updateRolInput);
  }

  @Mutation(() => Boolean, {
    name: 'eliminarRol',
    description: 'Elimina un rol por su ID'
  })
  async eliminarRol(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    return this.rolService.remove(id);
  }
}
