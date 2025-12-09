import { Module, Global } from '@nestjs/common';
import { WebhookController } from './webhook/webhook.controller';
import { WebhookService } from './webhook/webhook.service';
import { NotificationsGateway } from './gateway/notifications.gateway';

@Global() // Hacer el módulo global para que WebhookService esté disponible en todos lados
@Module({
  controllers: [WebhookController],
  providers: [NotificationsGateway, WebhookService],
  exports: [NotificationsGateway, WebhookService],
})
export class WebsocketModule {}
