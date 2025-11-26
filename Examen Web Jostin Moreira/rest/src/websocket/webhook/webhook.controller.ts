import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { NotificationsGateway } from '../gateway/notifications.gateway';
import { WebhookNotificationDto } from './webhook-notification.dto';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly notificationsGateway: NotificationsGateway) {}

  @Post('notificaciones')
  @HttpCode(200)
  async receiveNotification(@Body() notification: WebhookNotificationDto) {
    // Validar notificación
    if (!notification.id || !notification.entity || !notification.operation) {
      return {
        success: false,
        message: 'Datos de notificación inválidos',
      };
    }

    // Enviar notificación a través del WebSocketGateway
    this.notificationsGateway.sendNotification({
      id: notification.id,
      entity: notification.entity,
      operation: notification.operation,
      data: notification.data,
      timestamp: notification.timestamp || new Date().toISOString(),
    });

    return {
      success: true,
      message: 'Notificación enviada a WebSocket',
      notification,
    };
  }
}
