import { Injectable } from '@nestjs/common';
import { CreateNotificacioneInput } from './dto/create-notificacione.input';
import { UpdateNotificacioneInput } from './dto/update-notificacione.input';

@Injectable()
export class NotificacionesService {
  create(createNotificacioneInput: CreateNotificacioneInput) {
    return 'This action adds a new notificacione';
  }

  findAll() {
    return `This action returns all notificaciones`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notificacione`;
  }

  update(id: number, updateNotificacioneInput: UpdateNotificacioneInput) {
    return `This action updates a #${id} notificacione`;
  }

  remove(id: number) {
    return `This action removes a #${id} notificacione`;
  }
}
