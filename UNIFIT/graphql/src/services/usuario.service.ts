import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { CreateUsuarioInput, UpdateUsuarioInput, UsuarioFilterInput } from '../dto/usuario.input';
import { UsuarioActivo, ResumenUsuario } from '../dto/reportes.types';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async findAll(filter?: UsuarioFilterInput): Promise<Usuario[]> {
    const where: any = {};

    if (filter) {
      if (filter.tipo) where.tipo = filter.tipo;
      if (filter.activo !== undefined) where.activo = filter.activo;
      if (filter.rolId) where.rol = { id: filter.rolId };
    }

    return this.usuarioRepository.find({
      where,
      relations: ['rol', 'reservas'],
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
      relations: ['rol', 'reservas', 'reservas.rutina'],
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return usuario;
  }

  async create(createUsuarioInput: CreateUsuarioInput): Promise<Usuario> {
    const usuario = this.usuarioRepository.create({
      ...createUsuarioInput,
      rol: createUsuarioInput.rolId ? { id: createUsuarioInput.rolId } as any : undefined,
    });

    return this.usuarioRepository.save(usuario);
  }

  async update(id: number, updateUsuarioInput: UpdateUsuarioInput): Promise<Usuario> {
    const usuario = await this.findOne(id);

    Object.assign(usuario, updateUsuarioInput);

    if (updateUsuarioInput.rolId) {
      usuario.rol = { id: updateUsuarioInput.rolId } as any;
    }

    return this.usuarioRepository.save(usuario);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.usuarioRepository.delete(id);
    return result.affected > 0;
  }

  // Reportes complejos

  async getUsuariosActivos(limite?: number): Promise<UsuarioActivo[]> {
    const usuarios = await this.usuarioRepository.find({
      where: { activo: true },
      relations: ['reservas'],
    });

    const usuariosActivos = usuarios.map(usuario => {
      const reservasCompletadas = usuario.reservas.filter(
        r => r.estado === 'finalizada' && r.asistio
      ).length;
      
      const totalReservas = usuario.reservas.length;
      const porcentajeAsistencia = totalReservas > 0 
        ? (reservasCompletadas / totalReservas) * 100 
        : 0;

      return {
        usuarioId: usuario.id,
        nombreUsuario: usuario.nombre,
        correo: usuario.correo,
        tipo: usuario.tipo,
        totalReservas,
        reservasCompletadas,
        porcentajeAsistencia: parseFloat(porcentajeAsistencia.toFixed(2)),
      };
    });

    // Ordenar por total de reservas
    usuariosActivos.sort((a, b) => b.totalReservas - a.totalReservas);

    return limite ? usuariosActivos.slice(0, limite) : usuariosActivos;
  }

  async getResumenUsuario(usuarioId: number): Promise<ResumenUsuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id: usuarioId },
      relations: ['reservas', 'reservas.rutina'],
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${usuarioId} no encontrado`);
    }

    const ahora = new Date();
    const reservasProximas = usuario.reservas.filter(
      r => r.estado === 'activa' && new Date(r.fecha) > ahora
    ).length;

    const reservasCompletadas = usuario.reservas.filter(
      r => r.estado === 'finalizada' && r.asistio
    ).length;

    const reservasConCalificacion = usuario.reservas.filter(r => r.calificacion);
    const sumaCalificaciones = reservasConCalificacion.reduce(
      (sum, r) => sum + (r.calificacion || 0), 0
    );
    const calificacionPromedio = reservasConCalificacion.length > 0
      ? sumaCalificaciones / reservasConCalificacion.length
      : 0;

    const ultimaReservaObj = usuario.reservas.length > 0
      ? usuario.reservas.sort((a, b) => 
          new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        )[0]
      : null;

    return {
      usuarioId: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      totalReservas: usuario.reservas.length,
      reservasProximas,
      reservasCompletadas,
      calificacionPromedio: parseFloat(calificacionPromedio.toFixed(2)),
      ultimaReserva: ultimaReservaObj 
        ? ultimaReservaObj.fecha.toISOString() 
        : 'Sin reservas',
    };
  }
}
