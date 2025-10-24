// src/incidencias/incidencias.resolver.ts
import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { IncidenciaType } from '../types/incidencias.type';
import { IncidenciasRestService } from './incidencias.service';

@Resolver(() => IncidenciaType)
export class IncidenciasResolver {
  constructor(private incidenciasService: IncidenciasRestService) {}

  @Query(() => [IncidenciaType], { name: 'incidencias' })
  async getIncidencias() {
    return this.incidenciasService.findAll();
  }

  @Query(() => IncidenciaType, { name: 'incidencia' })
  async getIncidencia(@Args('id', { type: () => Int }) id: number) {
    return this.incidenciasService.findOne(id);
  }
}
