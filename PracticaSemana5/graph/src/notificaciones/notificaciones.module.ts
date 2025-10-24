import { Module } from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';
import { NotificacionesResolver } from './notificaciones.resolver';

@Module({
  providers: [NotificacionesResolver, NotificacionesService],
})
export class NotificacionesModule {}
