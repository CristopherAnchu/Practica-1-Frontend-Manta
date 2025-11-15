import { Body, Controller, Post } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('user-created')
  notifyUserCreated(@Body() userData: any) {
    return this.notificationsService.notifyUserCreated(userData);
  }

  @Post('reserva-created')
  notifyReservaCreated(@Body() reservaData: any) {
    return this.notificationsService.notifyReservaCreated(reservaData);
  }

  @Post('rutina-created')
  notifyRutinaCreated(@Body() rutinaData: any) {
    return this.notificationsService.notifyRutinaCreated(rutinaData);
  }

  @Post('equipo-created')
  notifyEquipoCreated(@Body() equipoData: any) {
    return this.notificationsService.notifyEquipoCreated(equipoData);
  }

  @Post('incidencia-created')
  notifyIncidenciaCreated(@Body() incidenciaData: any) {
    return this.notificationsService.notifyIncidenciaCreated(incidenciaData);
  }

  @Post('asistencia-updated')
  notifyAsistenciaUpdated(@Body() asistenciaData: any) {
    return this.notificationsService.notifyAsistenciaUpdated(asistenciaData);
  }

  @Post('general')
  notifyGeneral(@Body() body: { message: string; data?: any }) {
    return this.notificationsService.notifyGeneral(body.message, body.data);
  }

  @Post('emit')
  emit(@Body() body: { event: string; data: any }) {
    return this.notificationsService.sendNotification(body.event, body.data);
  }
}
