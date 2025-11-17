import { Injectable } from '@nestjs/common';
import { CreateEquipoDto } from './dto/create-equipo.dto';
import { UpdateEquipoDto } from './dto/update-equipo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Equipo } from './entities/equipo.entity'

@Injectable()
export class EquiposService {
  async create(createEquipoDto: CreateEquipoDto) {
    const equipo = this.equipoRepository.create(createEquipoDto);
    return await this.equipoRepository.save(equipo);
  }
  constructor(
    @InjectRepository(Equipo) 
    private readonly equipoRepository: Repository<Equipo>,
  ) {}

  async findAll() {
    return `This action returns all equipos`;
  }

  async findOne(id: string) {
    const equipo = this.equipoRepository.findOneBy({id})
    if (!equipo)
      throw new Error(`Equipo con el id ${id} no encontrado`);
    return equipo;
  }

  async update(id: string, updateEquipoDto: UpdateEquipoDto) {
    const equipo = await this.equipoRepository.findOneBy({id})
    if (!equipo)
      throw new Error(`Equipo con el id ${id} no encontrado`);
    await this.equipoRepository.update(id, updateEquipoDto);
    return this.equipoRepository.findOneBy({id});
  }

  async remove(id: string) {
    const equipo = this.findOne(id);
    await this.equipoRepository.delete(id);
    return `This action removes a #${id} equipo`;
  }
}
