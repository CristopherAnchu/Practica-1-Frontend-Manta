import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reserva } from './entities/reserva.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';

@Injectable()
export class ReservasService {
  constructor(
    @InjectRepository(Reserva)
    private readonly reservaRepository: Repository<Reserva>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createReservaDto: CreateReservaDto) {
    const usuario = await this.userRepository.findOne({
      where: { id: createReservaDto.usuarioId },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const reserva = this.reservaRepository.create({
      fecha: createReservaDto.fecha,
      horaInicio: createReservaDto.horaInicio,
      horaFin: createReservaDto.horaFin,
      tipoActividad: createReservaDto.tipoActividad,
      usuario,
      estado: 'pendiente',
    });

    return await this.reservaRepository.save(reserva);
  }

  async findAll() {
    return await this.reservaRepository.find({
      relations: ['usuario'], 
    });
  }

  async findOne(id: string) {
    const reserva = await this.reservaRepository.findOne({
      where: { id },
      relations: ['usuario'],
    });

    if (!reserva) {
      throw new NotFoundException(`Reserva con ID ${id} no encontrada`);
    }

    return reserva;
  }

  async update(id: string, updateReservaDto: UpdateReservaDto) {
    const reserva = await this.reservaRepository.preload({
      id,
      ...updateReservaDto,
    });

    if (!reserva) {
      throw new NotFoundException(`Reserva con ID ${id} no encontrada`);
    }

    return await this.reservaRepository.save(reserva);
  }


  async remove(id: string) {
    const reserva = await this.findOne(id);
    return await this.reservaRepository.remove(reserva);
  }
}
