import { Injectable } from '@nestjs/common';
import { DivicesGateway } from 'src/divices/divices.gateway';

@Injectable()
export class NotificationsService {
  constructor(private readonly divicesGateway: DivicesGateway) {}

  sendNotification(event: string, data: any) {
    this.divicesGateway.emitirEvento(event, {
      ...data,
      timestamp: new Date().toISOString()
    });
    return { success: true, event, data };
  }

  notifyUserCreated(userData: any) {
    return this.sendNotification('user-created', userData);
  }

  notifyReservaCreated(reservaData: any) {
    return this.sendNotification('reserva-created', reservaData);
  }

  notifyRutinaCreated(rutinaData: any) {
    return this.sendNotification('rutina-created', rutinaData);
  }

  notifyEquipoCreated(equipoData: any) {
    return this.sendNotification('equipo-created', equipoData);
  }

  notifyIncidenciaCreated(incidenciaData: any) {
    return this.sendNotification('incidencia-created', incidenciaData);
  }

  notifyAsistenciaUpdated(asistenciaData: any) {
    return this.sendNotification('asistencia-updated', asistenciaData);
  }

  notifyGeneral(message: string, data?: any) {
    return this.sendNotification('general-notification', { message, data });
  }
}
