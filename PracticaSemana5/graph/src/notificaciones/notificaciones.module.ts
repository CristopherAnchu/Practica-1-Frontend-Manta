// src/notificaciones/notificaciones.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { NotificacionesRestService } from './notificaciones.service';
import { NotificacionesResolver } from './notificaciones.resolver';
import { UsersModule } from '../users/users.module'; // Para relaciones

@Module({
  imports: [HttpModule, UsersModule],
  providers: [NotificacionesResolver, NotificacionesRestService],
  exports: [NotificacionesRestService],
})
export class NotificacionesModule {}
