import { Injectable } from '@nestjs/common';
import { CreateCapacidadeDto } from './dto/create-capacidade.dto';
import { UpdateCapacidadeDto } from './dto/update-capacidade.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Capacidad } from './entities/capacidad.entity';

@Injectable()
export class CapacidadesService {
  
  constructor(
    @InjectRepository(Capacidad) 
    private readonly capacidadRepository: Repository<Capacidad>,
  ) {}
  
  async create(createCapacidadeDto: CreateCapacidadeDto) {
    const capacidad = this.capacidadRepository.create(createCapacidadeDto);
    return await this.capacidadRepository.save(capacidad);
  }

  async findAll() {
    return `This action returns all capacidades`;
  }

  async findOne(id: string) {
    const user = await this.capacidadRepository.findOneBy({id})
    if (!user)
      throw new Error(`Capacidad con el id ${id} no encontrado`);
    return Capacidad;
  }

  async update(id: string, updateCapacidadeDto: UpdateCapacidadeDto) {
    const capacidad = await this.capacidadRepository.findOneBy({id})
    if (!capacidad)
      throw new Error(`Capacidad con el id ${id} no encontrado`);
    await this.capacidadRepository.update(id, updateCapacidadeDto);
    return this.capacidadRepository.findOneBy({id});
  }

  async remove(id: string) {
    const capacidad = this.findOne(id);
    await this.capacidadRepository.delete(id);
    return `This action removes a #${id} capacidade`;
  }
}
