import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rutina } from '../entities/rutina.entity';
import { CreateRutinaInput, UpdateRutinaInput, RutinaFilterInput } from '../dto/rutina.input';
import { RutinaPopular } from '../dto/reportes.types';

@Injectable()
export class RutinaService {
  constructor(
    @InjectRepository(Rutina)
    private rutinaRepository: Repository<Rutina>,
  ) {}

  async findAll(filter?: RutinaFilterInput): Promise<Rutina[]> {
    const where: any = {};

    if (filter) {
      if (filter.nivel) where.nivel = filter.nivel;
      if (filter.activa !== undefined) where.activa = filter.activa;
      if (filter.instructor) where.instructor = filter.instructor;
    }

    return this.rutinaRepository.find({
      where,
      relations: ['reservas'],
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Rutina> {
    const rutina = await this.rutinaRepository.findOne({
      where: { id },
      relations: ['reservas', 'reservas.usuario'],
    });

    if (!rutina) {
      throw new NotFoundException(`Rutina con ID ${id} no encontrada`);
    }

    return rutina;
  }

  async create(createRutinaInput: CreateRutinaInput): Promise<Rutina> {
    const rutina = this.rutinaRepository.create(createRutinaInput);
    return this.rutinaRepository.save(rutina);
  }

  async update(id: number, updateRutinaInput: UpdateRutinaInput): Promise<Rutina> {
    const rutina = await this.findOne(id);
    Object.assign(rutina, updateRutinaInput);
    return this.rutinaRepository.save(rutina);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.rutinaRepository.delete(id);
    return result.affected > 0;
  }

  // Reportes complejos

  async getRutinasPopulares(limite?: number): Promise<RutinaPopular[]> {
    const rutinas = await this.rutinaRepository.find({
      where: { activa: true },
      relations: ['reservas'],
    });

    const rutinasPopulares = rutinas.map(rutina => {
      const totalReservas = rutina.reservas.length;
      const ocupacionPromedio = totalReservas > 0 
        ? (totalReservas / rutina.cupoMaximo) * 100 
        : 0;

      const reservasConCalificacion = rutina.reservas.filter(r => r.calificacion);
      const sumaCalificaciones = reservasConCalificacion.reduce(
        (sum, r) => sum + (r.calificacion || 0), 0
      );
      const calificacionPromedio = reservasConCalificacion.length > 0
        ? sumaCalificaciones / reservasConCalificacion.length
        : null;

      return {
        rutinaId: rutina.id,
        nombreRutina: rutina.nombre,
        totalReservas,
        cupoMaximo: rutina.cupoMaximo,
        ocupacionPromedio: parseFloat(ocupacionPromedio.toFixed(2)),
        calificacionPromedio: calificacionPromedio 
          ? parseFloat(calificacionPromedio.toFixed(2)) 
          : null,
      };
    });

    // Ordenar por total de reservas
    rutinasPopulares.sort((a, b) => b.totalReservas - a.totalReservas);

    return limite ? rutinasPopulares.slice(0, limite) : rutinasPopulares;
  }

  async actualizarCalificacionPromedio(rutinaId: number): Promise<Rutina> {
    const rutina = await this.findOne(rutinaId);
    
    const reservasConCalificacion = rutina.reservas.filter(r => r.calificacion);
    
    if (reservasConCalificacion.length > 0) {
      const sumaCalificaciones = reservasConCalificacion.reduce(
        (sum, r) => sum + (r.calificacion || 0), 0
      );
      rutina.calificacionPromedio = parseFloat(
        (sumaCalificaciones / reservasConCalificacion.length).toFixed(2)
      );
    } else {
      rutina.calificacionPromedio = null;
    }

    return this.rutinaRepository.save(rutina);
  }
}
