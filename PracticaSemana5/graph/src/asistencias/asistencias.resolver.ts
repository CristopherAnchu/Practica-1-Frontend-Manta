// src/asistencias/asistencias.resolver.ts
import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { AsistenciaType } from '../types/asistencias.type';
import { AsistenciasRestService } from './asistencias.service';

@Resolver(() => AsistenciaType)
export class AsistenciasResolver {
  constructor(private asistenciasService: AsistenciasRestService) {}

  @Query(() => [AsistenciaType], { name: 'asistencias' })
  async getAsistencias() {
    return this.asistenciasService.findAll();
  }

  @Query(() => AsistenciaType, { name: 'asistencia' })
  async getAsistencia(@Args('id', { type: () => Int }) id: string) {
    return this.asistenciasService.findOne(id);
  }
}
