import { Injectable } from '@nestjs/common';
import { CreateReservaInput } from './dto/create-reserva.input';
import { UpdateReservaInput } from './dto/update-reserva.input';

@Injectable()
export class ReservasService {
  create(createReservaInput: CreateReservaInput) {
    return 'This action adds a new reserva';
  }

  findAll() {
    return `This action returns all reservas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reserva`;
  }

  update(id: number, updateReservaInput: UpdateReservaInput) {
    return `This action updates a #${id} reserva`;
  }

  remove(id: number) {
    return `This action removes a #${id} reserva`;
  }
}
