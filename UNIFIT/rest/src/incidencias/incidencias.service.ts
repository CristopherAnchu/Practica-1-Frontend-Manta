import { Injectable } from '@nestjs/common';
import { CreateIncidenciaDto } from './dto/create-incidencia.dto';
import { UpdateIncidenciaDto } from './dto/update-incidencia.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incidencia } from './entities/incidencia.entity'

@Injectable()
export class IncidenciasService {
  async create(createIncidenciaDto: CreateIncidenciaDto) {
    const incidencia = this.incidenciaRepository.create(createIncidenciaDto);
    return await this.incidenciaRepository.save(incidencia);
  }
  constructor(
    @InjectRepository(Incidencia) 
    private readonly incidenciaRepository: Repository<Incidencia>,
  ) {}

  async findAll() {
    return `This action returns all incidencias`;
  }

  async findOne(id: string) {
    const incidencia = this.incidenciaRepository.findOneBy({id})
    if (!incidencia)
      throw new Error(`Incidencia con el id ${id} no encontrada`);
    return incidencia;
  }

  async update(id: string, updateIncidenciaDto: UpdateIncidenciaDto) {
    const incidencia = await this.incidenciaRepository.findOneBy({id})
    if (!incidencia)
      throw new Error(`Incidencia con el id ${id} no encontrada`);
    await this.incidenciaRepository.update(id, updateIncidenciaDto);
    return this.incidenciaRepository.findOneBy({id});
  }

  async remove(id: string) {
    const incidencia = this.findOne(id);
    await this.incidenciaRepository.delete(id);
    return `This action removes a #${id} incidencia`;
  }
}
