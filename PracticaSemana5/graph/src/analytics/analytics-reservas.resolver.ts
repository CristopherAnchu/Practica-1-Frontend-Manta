// src/analytics/analytics-reservas.resolver.ts
import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { ReservasRestService } from '../reservas/reservas.service';
import { EstadisticasReservasType } from '../types/estadisticas-reservas.type';

@Resolver()
export class AnalyticsReservasResolver {
  constructor(private reservasService: ReservasRestService) {}

  @Query(() => EstadisticasReservasType)
  async estadisticasReservasMensuales(
    @Args('mes', { type: () => Int }) mes: number,
    @Args('anio', { type: () => Int }) anio: number,
  ) {
    const reservas = await this.reservasService.findAll();

    const reservasMes = reservas.filter(r => {
      const fecha = new Date(r.fecha);
      return fecha.getMonth() + 1 === mes && fecha.getFullYear() === anio;
    });

    const totalReservas = reservasMes.length;
    const reservaMax = Math.max(...reservasMes.map(r => r.duracion || 0));
    const reservaMin = Math.min(...reservasMes.map(r => r.duracion || 0));
    const duracionPromedio = reservasMes.reduce((sum, r) => sum + (r.duracion || 0), 0) / (reservasMes.length || 1);

    return {
      mes,
      anio,
      totalReservas,
      duracionPromedio,
      reservaMax,
      reservaMin,
    };
  }
}
