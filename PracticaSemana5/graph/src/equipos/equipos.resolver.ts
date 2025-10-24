import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { EquiposService } from './equipos.service';
import { Equipo } from './entities/equipo.entity';
import { CreateEquipoInput } from './dto/create-equipo.input';
import { UpdateEquipoInput } from './dto/update-equipo.input';

@Resolver(() => Equipo)
export class EquiposResolver {
  constructor(private readonly equiposService: EquiposService) {}

  @Mutation(() => Equipo)
  createEquipo(@Args('createEquipoInput') createEquipoInput: CreateEquipoInput) {
    return this.equiposService.create(createEquipoInput);
  }

  @Query(() => [Equipo], { name: 'equipos' })
  findAll() {
    return this.equiposService.findAll();
  }

  @Query(() => Equipo, { name: 'equipo' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.equiposService.findOne(id);
  }

  @Mutation(() => Equipo)
  updateEquipo(@Args('updateEquipoInput') updateEquipoInput: UpdateEquipoInput) {
    return this.equiposService.update(updateEquipoInput.id, updateEquipoInput);
  }

  @Mutation(() => Equipo)
  removeEquipo(@Args('id', { type: () => Int }) id: number) {
    return this.equiposService.remove(id);
  }
}
