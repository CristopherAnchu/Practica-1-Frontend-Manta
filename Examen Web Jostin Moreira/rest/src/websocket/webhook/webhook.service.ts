import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);
  private readonly webhookUrl = 'http://localhost:3000/api/webhook/notificaciones';

  async notifyCreate(entity: string, id: string, data: any) {
    return this.sendNotification(entity, 'create', id, data);
  }

  async notifyUpdate(entity: string, id: string, data: any) {
    return this.sendNotification(entity, 'update', id, data);
  }

  private async sendNotification(
    entity: string,
    operation: string,
    id: string,
    data: any,
  ) {
    try {
      const notification = {
        id,
        entity,
        operation,
        data,
        timestamp: new Date().toISOString(),
      };

      // Usar fetch nativo de Node.js 18+
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notification),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      this.logger.log(`✅ Webhook notificado: ${entity} - ${operation} - ${id}`);
      return result;
    } catch (error) {
      this.logger.error(`❌ Error al notificar webhook: ${error.message}`);
      // No lanzar error para no romper el flujo del REST
      return null;
    }
  }
}
