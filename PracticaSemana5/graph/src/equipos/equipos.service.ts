import { Injectable } from '@nestjs/common';
import { CreateEquipoInput } from './dto/create-equipo.input';
import { UpdateEquipoInput } from './dto/update-equipo.input';

@Injectable()
export class EquiposService {
  create(createEquipoInput: CreateEquipoInput) {
    return 'This action adds a new equipo';
  }

  findAll() {
    return `This action returns all equipos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} equipo`;
  }

  update(id: number, updateEquipoInput: UpdateEquipoInput) {
    return `This action updates a #${id} equipo`;
  }

  remove(id: number) {
    return `This action removes a #${id} equipo`;
  }
}
