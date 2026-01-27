import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WebhookEmitterService {
  private readonly logger = new Logger(WebhookEmitterService.name);
  private readonly webhookUrl: string;

  constructor(private readonly httpService: HttpService) {
    this.webhookUrl = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/exam2p-audit';
  }

  async emitWebhook(payload: any): Promise<void> {
    try {
      const eventPayload = {
        event: 'exam2p.audit.deletion',
        timestamp: new Date().toISOString(),
        data: payload
      };

      this.logger.log(`Emitting webhook to n8n: ${this.webhookUrl}`);
      this.logger.log(`Payload: ${JSON.stringify(eventPayload)}`);

      const response = await firstValueFrom(
        this.httpService.post(this.webhookUrl, eventPayload)
      );

      this.logger.log(`Webhook emitted successfully. Status: ${response.status}`);
    } catch (error) {
      this.logger.error(`Error emitting webhook: ${error.message}`, error.stack);
    }
  }
}
