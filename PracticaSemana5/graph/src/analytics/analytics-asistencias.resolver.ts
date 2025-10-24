// src/analytics/analytics-asistencias.resolver.ts
import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { AsistenciasRestService } from '../asistencias/asistencias.service';
import { UsersRestService } from '../users/users.service';
import { EstadisticasAsistenciasType } from '../types/estadisticas-asistencias.type';

@Resolver()
export class AnalyticsAsistenciasResolver {
  constructor(
    private asistenciasService: AsistenciasRestService,
    private usersService: UsersRestService,
  ) {}

  @Query(() => EstadisticasAsistenciasType)
  async estadisticasAsistenciasMensuales(
    @Args('mes', { type: () => Int }) mes: number,
    @Args('anio', { type: () => Int }) anio: number,
  ) {
    const asistencias = await this.asistenciasService.findAll(); // todos los registros

    // Filtrar por mes y año
    const asistenciasMes = asistencias.filter(a => {
      const fecha = new Date(a.fecha);
      return fecha.getMonth() + 1 === mes && fecha.getFullYear() === anio;
    });

    const totalAsistencias = asistenciasMes.length;

    // Por usuario
    const asistenciasPorUsuario = asistenciasMes.reduce((acc, a) => {
      acc[a.userId] = (acc[a.userId] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return {
      mes,
      anio,
      totalAsistencias,
      asistenciasPorUsuario,
    };
  }
}
