import { Injectable } from '@nestjs/common';
import { CreateIncidenciaInput } from './dto/create-incidencia.input';
import { UpdateIncidenciaInput } from './dto/update-incidencia.input';

@Injectable()
export class IncidenciasService {
  create(createIncidenciaInput: CreateIncidenciaInput) {
    return 'This action adds a new incidencia';
  }

  findAll() {
    return `This action returns all incidencias`;
  }

  findOne(id: number) {
    return `This action returns a #${id} incidencia`;
  }

  update(id: number, updateIncidenciaInput: UpdateIncidenciaInput) {
    return `This action updates a #${id} incidencia`;
  }

  remove(id: number) {
    return `This action removes a #${id} incidencia`;
  }
}
