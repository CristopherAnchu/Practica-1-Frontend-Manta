import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { IncidenciasService } from './incidencias.service';
import { Incidencia } from './entities/incidencia.entity';
import { CreateIncidenciaInput } from './dto/create-incidencia.input';
import { UpdateIncidenciaInput } from './dto/update-incidencia.input';

@Resolver(() => Incidencia)
export class IncidenciasResolver {
  constructor(private readonly incidenciasService: IncidenciasService) {}

  @Mutation(() => Incidencia)
  createIncidencia(@Args('createIncidenciaInput') createIncidenciaInput: CreateIncidenciaInput) {
    return this.incidenciasService.create(createIncidenciaInput);
  }

  @Query(() => [Incidencia], { name: 'incidencias' })
  findAll() {
    return this.incidenciasService.findAll();
  }

  @Query(() => Incidencia, { name: 'incidencia' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.incidenciasService.findOne(id);
  }

  @Mutation(() => Incidencia)
  updateIncidencia(@Args('updateIncidenciaInput') updateIncidenciaInput: UpdateIncidenciaInput) {
    return this.incidenciasService.update(updateIncidenciaInput.id, updateIncidenciaInput);
  }

  @Mutation(() => Incidencia)
  removeIncidencia(@Args('id', { type: () => Int }) id: number) {
    return this.incidenciasService.remove(id);
  }
}
