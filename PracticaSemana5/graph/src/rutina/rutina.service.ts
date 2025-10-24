import { Injectable } from '@nestjs/common';
import { CreateRutinaInput } from './dto/create-rutina.input';
import { UpdateRutinaInput } from './dto/update-rutina.input';

@Injectable()
export class RutinaService {
  create(createRutinaInput: CreateRutinaInput) {
    return 'This action adds a new rutina';
  }

  findAll() {
    return `This action returns all rutina`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rutina`;
  }

  update(id: number, updateRutinaInput: UpdateRutinaInput) {
    return `This action updates a #${id} rutina`;
  }

  remove(id: number) {
    return `This action removes a #${id} rutina`;
  }
}
