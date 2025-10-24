// src/horarios/horarios.resolver.ts
import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { HorarioType } from '../types/horarios.type';
import { HorariosRestService } from './horarios.service';

@Resolver(() => HorarioType)
export class HorariosResolver {
  constructor(private horariosService: HorariosRestService) {}

  @Query(() => [HorarioType], { name: 'horarios' })
  async getHorarios() {
    return this.horariosService.findAll();
  }

  @Query(() => HorarioType, { name: 'horario' })
  async getHorario(@Args('id', { type: () => Int }) id: number) {
    return this.horariosService.findOne(id);
  }
}
