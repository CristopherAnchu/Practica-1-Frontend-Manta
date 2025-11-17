import { Injectable } from '@nestjs/common';
import { CreateHorarioDto } from './dto/create-horario.dto';
import { UpdateHorarioDto } from './dto/update-horario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Horario } from './entities/horario.entity';

@Injectable()
export class HorariosService {

  constructor(
    @InjectRepository(Horario)
    private readonly horarioRepository: Repository<Horario>,
  ) {}

  async create(createHorarioDto: CreateHorarioDto) {
    const horario = this.horarioRepository.create(createHorarioDto);
    return await this.horarioRepository.save(horario);
  }

  async findAll() {
    return `This action returns all horarios`;
  }

  async findOne(id: string) {
    const horario = await this.horarioRepository.findOneBy({id})
    if (!horario)
      throw new Error(`Horario con el id ${id} no encontrado`);
    return horario;
  }

  async update(id: string, updateHorarioDto: UpdateHorarioDto) {
    const horario = await this.horarioRepository.findOneBy({id})
    if (!horario)
      throw new Error(`Horario con el id ${id} no encontrado`);
    await this.horarioRepository.update(id, updateHorarioDto);
    return this.horarioRepository.findOneBy({id});
  }

  async remove(id: string) {
    const horario = this.findOne(id);
    await this.horarioRepository.delete(id);
    return `This action removes a #${id} horario`;
  }
}
