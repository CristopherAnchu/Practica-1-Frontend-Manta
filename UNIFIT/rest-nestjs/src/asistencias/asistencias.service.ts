import { Injectable } from '@nestjs/common';
import { CreateAsistenciaDto } from './dto/create-asistencia.dto';
import { UpdateAsistenciaDto } from './dto/update-asistencia.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asistencia } from './entities/asistencia.entity';

@Injectable()
export class AsistenciasService {

  constructor(
    @InjectRepository(Asistencia)
    private readonly asistenciaRepository: Repository<Asistencia>,
  ) {}

  async create(createAsistenciaDto: CreateAsistenciaDto) {
    const asistencia = this.asistenciaRepository.create(createAsistenciaDto);
    return await this.asistenciaRepository.save(asistencia);
  }

  async findAll() {
    return `This action returns all asistencias`;
  }

  async findOne(id: string) {
    const asistencia = await this.asistenciaRepository.findOneBy({id})
    if (!asistencia)
      throw new Error(`Asistencia con el id ${id} no encontrado`);
    return asistencia;
  }

  async update(id: string, updateAsistenciaDto: UpdateAsistenciaDto) {
    const asistencia = await this.asistenciaRepository.findOneBy({id})
    if (!asistencia)
      throw new Error(`Asistencia con el id ${id} no encontrado`);
    await this.asistenciaRepository.update(id, updateAsistenciaDto);
    return this.asistenciaRepository.findOneBy({id});
  }

  async remove(id: string) {
    const asistencia = this.findOne(id);
    await this.asistenciaRepository.delete(id);
    return `This action removes a #${id} asistencia`;
  }
}
