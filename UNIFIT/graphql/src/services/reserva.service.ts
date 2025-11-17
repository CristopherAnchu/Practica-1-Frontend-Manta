import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Reserva } from '../entities/reserva.entity';
import { CreateReservaInput, UpdateReservaInput, ReservaFilterInput } from '../dto/reserva.input';
import { 
  EstadisticasReservas, 
  TendenciaReservas, 
  ReporteOcupacion 
} from '../dto/reportes.types';

@Injectable()
export class ReservaService {
  constructor(
    @InjectRepository(Reserva)
    private reservaRepository: Repository<Reserva>,
  ) {}

  async findAll(filter?: ReservaFilterInput): Promise<Reserva[]> {
    const where: any = {};

    if (filter) {
      if (filter.estado) where.estado = filter.estado;
      if (filter.usuarioId) where.usuario = { id: filter.usuarioId };
      if (filter.rutinaId) where.rutina = { id: filter.rutinaId };
      if (filter.asistio !== undefined) where.asistio = filter.asistio;

      if (filter.fechaInicio && filter.fechaFin) {
        where.fecha = Between(new Date(filter.fechaInicio), new Date(filter.fechaFin));
      } else if (filter.fechaInicio) {
        where.fecha = MoreThanOrEqual(new Date(filter.fechaInicio));
      } else if (filter.fechaFin) {
        where.fecha = LessThanOrEqual(new Date(filter.fechaFin));
      }
    }

    return this.reservaRepository.find({
      where,
      relations: ['usuario', 'rutina', 'usuario.rol'],
      order: { fecha: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Reserva> {
    const reserva = await this.reservaRepository.findOne({
      where: { id },
      relations: ['usuario', 'rutina', 'usuario.rol'],
    });

    if (!reserva) {
      throw new NotFoundException(`Reserva con ID ${id} no encontrada`);
    }

    return reserva;
  }

  async create(createReservaInput: CreateReservaInput): Promise<Reserva> {
    const reserva = this.reservaRepository.create({
      fecha: new Date(createReservaInput.fecha),
      observaciones: createReservaInput.observaciones,
      estado: 'activa',
      usuario: { id: createReservaInput.usuarioId } as any,
      rutina: { id: createReservaInput.rutinaId } as any,
    });

    return this.reservaRepository.save(reserva);
  }

  async update(id: number, updateReservaInput: UpdateReservaInput): Promise<Reserva> {
    const reserva = await this.findOne(id);

    if (updateReservaInput.fecha) {
      reserva.fecha = new Date(updateReservaInput.fecha);
    }
    if (updateReservaInput.estado) reserva.estado = updateReservaInput.estado;
    if (updateReservaInput.observaciones !== undefined) {
      reserva.observaciones = updateReservaInput.observaciones;
    }
    if (updateReservaInput.calificacion !== undefined) {
      reserva.calificacion = updateReservaInput.calificacion;
    }
    if (updateReservaInput.asistio !== undefined) {
      reserva.asistio = updateReservaInput.asistio;
    }

    return this.reservaRepository.save(reserva);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.reservaRepository.delete(id);
    return result.affected > 0;
  }

  // Métodos para reportes complejos

  async getEstadisticas(fechaInicio?: string, fechaFin?: string): Promise<EstadisticasReservas> {
    const where: any = {};

    if (fechaInicio && fechaFin) {
      where.fecha = Between(new Date(fechaInicio), new Date(fechaFin));
    }

    const [reservas, total] = await this.reservaRepository.findAndCount({ where });

    const activas = reservas.filter(r => r.estado === 'activa').length;
    const canceladas = reservas.filter(r => r.estado === 'cancelada').length;
    const finalizadas = reservas.filter(r => r.estado === 'finalizada').length;
    
    const asistencias = reservas.filter(r => r.asistio).length;
    const porcentajeAsistencia = total > 0 ? (asistencias / total) * 100 : 0;

    const reservasConCalificacion = reservas.filter(r => r.calificacion);
    const sumaCalificaciones = reservasConCalificacion.reduce((sum, r) => sum + (r.calificacion || 0), 0);
    const calificacionPromedio = reservasConCalificacion.length > 0 
      ? sumaCalificaciones / reservasConCalificacion.length 
      : 0;

    return {
      totalReservas: total,
      reservasActivas: activas,
      reservasCanceladas: canceladas,
      reservasFinalizadas: finalizadas,
      porcentajeAsistencia: parseFloat(porcentajeAsistencia.toFixed(2)),
      calificacionPromedio: parseFloat(calificacionPromedio.toFixed(2)),
    };
  }

  async getTendencias(fechaInicio: string, fechaFin: string): Promise<TendenciaReservas[]> {
    const reservas = await this.reservaRepository.find({
      where: {
        fecha: Between(new Date(fechaInicio), new Date(fechaFin)),
      },
    });

    // Agrupar por fecha
    const grupos = new Map<string, Reserva[]>();
    
    reservas.forEach(reserva => {
      const fecha = reserva.fecha.toISOString().split('T')[0];
      if (!grupos.has(fecha)) {
        grupos.set(fecha, []);
      }
      grupos.get(fecha).push(reserva);
    });

    const tendencias: TendenciaReservas[] = [];
    
    grupos.forEach((reservasDia, fecha) => {
      tendencias.push({
        fecha,
        totalReservas: reservasDia.length,
        reservasCreadas: reservasDia.filter(r => r.estado === 'activa').length,
        reservasCanceladas: reservasDia.filter(r => r.estado === 'cancelada').length,
        reservasCompletadas: reservasDia.filter(r => r.estado === 'finalizada' && r.asistio).length,
      });
    });

    return tendencias.sort((a, b) => a.fecha.localeCompare(b.fecha));
  }

  async getReporteOcupacion(fecha?: string): Promise<ReporteOcupacion[]> {
    const where: any = {};

    if (fecha) {
      const fechaBusqueda = new Date(fecha);
      const fechaInicio = new Date(fechaBusqueda);
      fechaInicio.setHours(0, 0, 0, 0);
      const fechaFin = new Date(fechaBusqueda);
      fechaFin.setHours(23, 59, 59, 999);
      
      where.fecha = Between(fechaInicio, fechaFin);
      where.estado = 'activa';
    }

    const reservas = await this.reservaRepository.find({
      where,
      relations: ['rutina'],
    });

    // Agrupar por rutina
    const grupos = new Map<number, Reserva[]>();
    
    reservas.forEach(reserva => {
      const rutinaId = reserva.rutina.id;
      if (!grupos.has(rutinaId)) {
        grupos.set(rutinaId, []);
      }
      grupos.get(rutinaId).push(reserva);
    });

    const reportes: ReporteOcupacion[] = [];

    grupos.forEach((reservasRutina, rutinaId) => {
      const rutina = reservasRutina[0].rutina;
      const reservasActivas = reservasRutina.filter(r => r.estado === 'activa').length;
      const porcentajeOcupacion = (reservasActivas / rutina.cupoMaximo) * 100;

      reportes.push({
        rutinaId: rutina.id,
        nombreRutina: rutina.nombre,
        fecha: fecha || new Date().toISOString().split('T')[0],
        reservasActivas,
        cupoMaximo: rutina.cupoMaximo,
        porcentajeOcupacion: parseFloat(porcentajeOcupacion.toFixed(2)),
        cuposDisponibles: rutina.cupoMaximo - reservasActivas,
      });
    });

    return reportes.sort((a, b) => b.porcentajeOcupacion - a.porcentajeOcupacion);
  }
}
