// src/notificaciones/notificaciones.resolver.ts
import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { NotificationType } from '../types/notificaciones.type';
import { NotificacionesRestService } from './notificaciones.service';

@Resolver(() => NotificationType)
export class NotificacionesResolver {
  constructor(private notificacionesService: NotificacionesRestService) {}

  @Query(() => [NotificationType], { name: 'notificaciones' })
  async getNotificaciones() {
    return this.notificacionesService.findAll();
  }

  @Query(() => NotificationType, { name: 'notificacion' })
  async getNotificacion(@Args('id', { type: () => Int }) id: number) {
    return this.notificacionesService.findOne(id);
  }
}
