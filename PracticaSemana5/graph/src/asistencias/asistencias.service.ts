import { Injectable } from '@nestjs/common';
import { CreateAsistenciaInput } from './dto/create-asistencia.input';
import { UpdateAsistenciaInput } from './dto/update-asistencia.input';

@Injectable()
export class AsistenciasService {
  create(createAsistenciaInput: CreateAsistenciaInput) {
    return 'This action adds a new asistencia';
  }

  findAll() {
    return `This action returns all asistencias`;
  }

  findOne(id: number) {
    return `This action returns a #${id} asistencia`;
  }

  update(id: number, updateAsistenciaInput: UpdateAsistenciaInput) {
    return `This action updates a #${id} asistencia`;
  }

  remove(id: number) {
    return `This action removes a #${id} asistencia`;
  }
}
