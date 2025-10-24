// src/reservas/reservas.resolver.ts
import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { ReservaType } from '../types/reserva.type';
import { ReservasRestService } from './reservas.service';

@Resolver(() => ReservaType)
export class ReservasResolver {
  constructor(private reservasService: ReservasRestService) {}

  @Query(() => [ReservaType], { name: 'reservas' })
  async getReservas() {
    return this.reservasService.findAll();
  }

  @Query(() => ReservaType, { name: 'reserva' })
  async getReserva(@Args('id', { type: () => Int }) id: number) {
    return this.reservasService.findOne(id);
  }
}
