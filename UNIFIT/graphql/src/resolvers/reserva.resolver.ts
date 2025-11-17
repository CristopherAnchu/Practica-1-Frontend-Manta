import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ReservaService } from '../services/reserva.service';
import { Reserva } from '../entities/reserva.entity';
import { CreateReservaInput, UpdateReservaInput, ReservaFilterInput } from '../dto/reserva.input';
import { 
  EstadisticasReservas, 
  TendenciaReservas, 
  ReporteOcupacion 
} from '../dto/reportes.types';

@Resolver(() => Reserva)
export class ReservaResolver {
  constructor(private readonly reservaService: ReservaService) {}

  // Queries

  @Query(() => [Reserva], { 
    name: 'reservas',
    description: 'Obtiene todas las reservas con filtros opcionales' 
  })
  async getReservas(
    @Args('filter', { type: () => ReservaFilterInput, nullable: true }) 
    filter?: ReservaFilterInput,
  ): Promise<Reserva[]> {
    return this.reservaService.findAll(filter);
  }

  @Query(() => Reserva, { 
    name: 'reserva',
    description: 'Obtiene una reserva por su ID' 
  })
  async getReserva(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Reserva> {
    return this.reservaService.findOne(id);
  }

  @Query(() => EstadisticasReservas, {
    name: 'estadisticasReservas',
    description: 'Obtiene estadísticas generales de reservas con rango de fechas opcional'
  })
  async getEstadisticasReservas(
    @Args('fechaInicio', { nullable: true }) fechaInicio?: string,
    @Args('fechaFin', { nullable: true }) fechaFin?: string,
  ): Promise<EstadisticasReservas> {
    return this.reservaService.getEstadisticas(fechaInicio, fechaFin);
  }

  @Query(() => [TendenciaReservas], {
    name: 'tendenciasReservas',
    description: 'Obtiene tendencias de reservas agrupadas por día'
  })
  async getTendenciasReservas(
    @Args('fechaInicio') fechaInicio: string,
    @Args('fechaFin') fechaFin: string,
  ): Promise<TendenciaReservas[]> {
    return this.reservaService.getTendencias(fechaInicio, fechaFin);
  }

  @Query(() => [ReporteOcupacion], {
    name: 'reporteOcupacion',
    description: 'Obtiene reporte de ocupación de rutinas por fecha'
  })
  async getReporteOcupacion(
    @Args('fecha', { nullable: true }) fecha?: string,
  ): Promise<ReporteOcupacion[]> {
    return this.reservaService.getReporteOcupacion(fecha);
  }

  // Mutations

  @Mutation(() => Reserva, {
    name: 'crearReserva',
    description: 'Crea una nueva reserva'
  })
  async crearReserva(
    @Args('input') createReservaInput: CreateReservaInput,
  ): Promise<Reserva> {
    return this.reservaService.create(createReservaInput);
  }

  @Mutation(() => Reserva, {
    name: 'actualizarReserva',
    description: 'Actualiza una reserva existente'
  })
  async actualizarReserva(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') updateReservaInput: UpdateReservaInput,
  ): Promise<Reserva> {
    return this.reservaService.update(id, updateReservaInput);
  }

  @Mutation(() => Boolean, {
    name: 'eliminarReserva',
    description: 'Elimina una reserva por su ID'
  })
  async eliminarReserva(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    return this.reservaService.remove(id);
  }
}
