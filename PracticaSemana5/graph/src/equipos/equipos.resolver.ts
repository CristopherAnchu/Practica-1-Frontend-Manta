// src/equipos/equipos.resolver.ts
import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { Equipo } from '../types/equipos.type';
import { EquiposRestService } from './equipos.service';

@Resolver(() => Equipo)
export class EquiposResolver {
  constructor(private equiposService: EquiposRestService) {}

  @Query(() => [Equipo], { name: 'equipos' })
  async getEquipos() {
    return this.equiposService.findAll();
  }

  @Query(() => Equipo, { name: 'equipo' })
  async getEquipo(@Args('id', { type: () => Int }) id: string) {
    return this.equiposService.findOne(id);
  }
}
