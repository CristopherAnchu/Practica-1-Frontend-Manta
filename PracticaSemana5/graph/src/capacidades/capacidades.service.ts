import { Injectable } from '@nestjs/common';
import { CreateCapacidadeInput } from './dto/create-capacidade.input';
import { UpdateCapacidadeInput } from './dto/update-capacidade.input';

@Injectable()
export class CapacidadesService {
  create(createCapacidadeInput: CreateCapacidadeInput) {
    return 'This action adds a new capacidade';
  }

  findAll() {
    return `This action returns all capacidades`;
  }

  findOne(id: number) {
    return `This action returns a #${id} capacidade`;
  }

  update(id: number, updateCapacidadeInput: UpdateCapacidadeInput) {
    return `This action updates a #${id} capacidade`;
  }

  remove(id: number) {
    return `This action removes a #${id} capacidade`;
  }
}
