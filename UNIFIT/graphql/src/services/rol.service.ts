import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from '../entities/rol.entity';
import { CreateRolInput, UpdateRolInput } from '../dto/rol.input';

@Injectable()
export class RolService {
  constructor(
    @InjectRepository(Rol)
    private rolRepository: Repository<Rol>,
  ) {}

  async findAll(): Promise<Rol[]> {
    return this.rolRepository.find({
      relations: ['usuarios'],
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Rol> {
    const rol = await this.rolRepository.findOne({
      where: { id },
      relations: ['usuarios'],
    });

    if (!rol) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    }

    return rol;
  }

  async create(createRolInput: CreateRolInput): Promise<Rol> {
    // Verificar si ya existe un rol con ese nombre
    const existente = await this.rolRepository.findOne({
      where: { nombre: createRolInput.nombre },
    });

    if (existente) {
      throw new ConflictException(`Ya existe un rol con el nombre "${createRolInput.nombre}"`);
    }

    const rol = this.rolRepository.create(createRolInput);
    return this.rolRepository.save(rol);
  }

  async update(id: number, updateRolInput: UpdateRolInput): Promise<Rol> {
    const rol = await this.findOne(id);

    // Si se intenta cambiar el nombre, verificar que no exista otro con ese nombre
    if (updateRolInput.nombre && updateRolInput.nombre !== rol.nombre) {
      const existente = await this.rolRepository.findOne({
        where: { nombre: updateRolInput.nombre },
      });

      if (existente) {
        throw new ConflictException(`Ya existe un rol con el nombre "${updateRolInput.nombre}"`);
      }
    }

    Object.assign(rol, updateRolInput);
    return this.rolRepository.save(rol);
  }

  async remove(id: number): Promise<boolean> {
    const rol = await this.findOne(id);

    if (rol.usuarios && rol.usuarios.length > 0) {
      throw new ConflictException(
        `No se puede eliminar el rol "${rol.nombre}" porque tiene ${rol.usuarios.length} usuarios asignados`
      );
    }

    const result = await this.rolRepository.delete(id);
    return result.affected > 0;
  }
}
