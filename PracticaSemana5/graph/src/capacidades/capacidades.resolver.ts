// src/capacidades/capacidades.resolver.ts
import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { CapacidadType } from '../types/capacidades.type';
import { CapacidadesRestService } from './capacidades.service';

@Resolver(() => CapacidadType)
export class CapacidadesResolver {
  constructor(private capacidadesService: CapacidadesRestService) {}

  @Query(() => [CapacidadType], { name: 'capacidades' })
  async getCapacidades() {
    return this.capacidadesService.findAll();
  }

  @Query(() => CapacidadType, { name: 'capacidad' })
  async getCapacidad(@Args('id', { type: () => Int }) id: string) {
    return this.capacidadesService.findOne(id);
  }
}
