import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rutina } from './entities/rutina.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateRutinaDto } from './dto/create-rutina.dto';
import { UpdateRutinaDto } from './dto/update-rutina.dto';

@Injectable()
export class RutinaService {
  constructor(
    @InjectRepository(Rutina)
    private readonly rutinaRepository: Repository<Rutina>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createRutinaDto: CreateRutinaDto): Promise<Rutina> {
    const usuario = await this.userRepository.findOne({ where: { id: createRutinaDto.usuarioId } });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const rutina = this.rutinaRepository.create({
      nombre: createRutinaDto.nombre,
      descripcion: createRutinaDto.descripcion,
      duracionMinutos: createRutinaDto.duracionMinutos,
      usuario,
    });

    return await this.rutinaRepository.save(rutina);
  }

  async findAll(): Promise<Rutina[]> {
    return await this.rutinaRepository.find({ relations: ['usuario'] });
  }

  async findOne(id: string): Promise<Rutina> {
    const rutina = await this.rutinaRepository.findOne({ where: { id }, relations: ['usuario'] });
    if (!rutina) {
      throw new NotFoundException(`Rutina con ID ${id} no encontrada`);
    }
    return rutina;
  }

  async update(id: string, updateRutinaDto: UpdateRutinaDto): Promise<Rutina> {
    let usuario;
    if (updateRutinaDto.usuarioId) {
      usuario = await this.userRepository.findOne({ where: { id: updateRutinaDto.usuarioId } });
      if (!usuario) {
        throw new NotFoundException('Usuario no encontrado');
      }
    }

    const rutina = await this.rutinaRepository.preload({
      id,
      ...updateRutinaDto,
      usuario: usuario || undefined,
    });

    if (!rutina) {
      throw new NotFoundException(`Rutina con ID ${id} no encontrada`);
    }

    return await this.rutinaRepository.save(rutina);
  }

  async remove(id: string): Promise<Rutina> {
    const rutina = await this.findOne(id);
    return await this.rutinaRepository.remove(rutina);
  }
}
