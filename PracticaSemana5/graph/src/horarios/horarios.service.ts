import { Injectable } from '@nestjs/common';
import { CreateHorarioInput } from './dto/create-horario.input';
import { UpdateHorarioInput } from './dto/update-horario.input';

@Injectable()
export class HorariosService {
  create(createHorarioInput: CreateHorarioInput) {
    return 'This action adds a new horario';
  }

  findAll() {
    return `This action returns all horarios`;
  }

  findOne(id: number) {
    return `This action returns a #${id} horario`;
  }

  update(id: number, updateHorarioInput: UpdateHorarioInput) {
    return `This action updates a #${id} horario`;
  }

  remove(id: number) {
    return `This action removes a #${id} horario`;
  }
}
