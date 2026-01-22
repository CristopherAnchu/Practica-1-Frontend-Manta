import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { Partner } from '../entities/payment.entity';
import { RegisterPartnerDto, PartnerWebhookEvent } from '../dto/partner.dto';
import { PartnerWebhookLog, WebhookDirection } from '../entities/partner-webhook-log.entity';

@Injectable()
export class PartnerService {
  constructor(
    @InjectRepository(Partner)
    private partnerRepository: Repository<Partner>,
    @InjectRepository(PartnerWebhookLog)
    private webhookLogRepository: Repository<PartnerWebhookLog>,
  ) {}

  /**
   * Registra un nuevo partner para recibir webhooks
   */
  async registerPartner(dto: RegisterPartnerDto): Promise<Partner> {
    // Generar API Key y HMAC Secret
    const apiKey = this.generateApiKey();
    const hmacSecret = this.generateHmacSecret();

    const partner = this.partnerRepository.create({
      name: dto.name,
      webhookUrl: dto.webhookUrl,
      subscribedEvents: dto.subscribedEvents,
      apiKey,
      hmacSecret,
    });

    await this.partnerRepository.save(partner);

    return partner;
  }

  /**
   * Obtiene un partner por API Key
   */
  async getPartnerByApiKey(apiKey: string): Promise<Partner | null> {
    return this.partnerRepository.findOne({ where: { apiKey, active: true } });
  }

  /**
   * Envía un webhook a un partner
   */
  async sendWebhookToPartner(partnerId: string, event: PartnerWebhookEvent): Promise<void> {
    const partner = await this.partnerRepository.findOne({ where: { id: partnerId } });

    if (!partner || !partner.active) {
      throw new Error('Partner no encontrado o inactivo');
    }

    // Verificar si el partner está suscrito a este evento
    if (!partner.subscribedEvents.includes(event.eventType)) {
      console.log(`Partner ${partner.name} no está suscrito al evento ${event.eventType}`);
      return;
    }

    const signature = this.generateHmacSignature(event, partner.hmacSecret);

    // Enviar webhook con reintentos sencillos (3 intentos con backoff exponencial)
    const maxAttempts = 3;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await fetch(partner.webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-UNIFIT-Signature': signature,
            'X-UNIFIT-Event': event.eventType,
          },
          body: JSON.stringify(event),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status} ${response.statusText}`);
        }

        await this.logWebhook(WebhookDirection.OUTBOUND, partner.id, event.eventType, event, signature, true);
        console.log(`✅ Webhook enviado exitosamente a ${partner.name} (intento ${attempt})`);
        return;
      } catch (error) {
        console.error(`Error enviando webhook a ${partner.name} (intento ${attempt}):`, error);
        await this.logWebhook(WebhookDirection.OUTBOUND, partner?.id ?? null, event.eventType, event, signature, false);
        if (attempt < maxAttempts) {
          const delayMs = Math.pow(2, attempt) * 500; // 1s, 2s, 4s
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      }
    }
  }

  /**
   * Verifica la firma HMAC de un webhook recibido
   */
  verifyHmacSignature(payload: any, signature: string, secret: string): boolean {
    try {
      const expectedSignature = this.generateHmacSignature(payload, secret);
      
      // Asegurar que ambas firmas sean strings válidos
      if (!signature || typeof signature !== 'string' || !expectedSignature) {
        return false;
      }

      // Si la firma entrante está en base64, convertirla a hex
      let normalizedSignature = signature;
      try {
        // Intentar decodificar si es base64
        const decodedBuffer = Buffer.from(signature, 'base64');
        normalizedSignature = decodedBuffer.toString('hex');
      } catch {
        // Si no es base64 válido, usar como está (asumiendo que es hex)
      }

      // Comparar usando strings en lugar de buffers para evitar problemas de longitud
      return normalizedSignature.toLowerCase() === expectedSignature.toLowerCase();
    } catch (error) {
      console.error('Error verificando HMAC signature:', error);
      return false;
    }
  }

  /**
   * Expone logging para webhooks entrantes (usable por controller)
   */
  async logInboundWebhook(partnerId: string, eventType: string, payload: any, signature: string | null, valid: boolean): Promise<void> {
    await this.logWebhook(WebhookDirection.INBOUND, partnerId, eventType, payload, signature, valid);
  }

  /**
   * Registra en BD el tráfico webhook (entrante/saliente)
   */
  private async logWebhook(
    direction: WebhookDirection,
    partnerId: string | null,
    eventType: string,
    payload: any,
    signature: string | null,
    valid: boolean,
  ): Promise<void> {
    await this.webhookLogRepository.save({
      direction,
      partnerId,
      eventType,
      payload,
      signature,
      valid,
    });
  }

  /**
   * Genera una firma HMAC-SHA256
   */
  private generateHmacSignature(payload: any, secret: string): string {
    const data = typeof payload === 'string' ? payload : JSON.stringify(payload);
    return crypto
      .createHmac('sha256', secret)
      .update(data)
      .digest('hex');
  }

  /**
   * Genera una API Key aleatoria
   */
  private generateApiKey(): string {
    return `unifit_${crypto.randomBytes(32).toString('hex')}`;
  }

  /**
   * Genera un HMAC Secret aleatorio
   */
  private generateHmacSecret(): string {
    return crypto.randomBytes(64).toString('hex');
  }

  /**
   * Lista todos los partners activos
   */
  async getAllPartners(): Promise<Partner[]> {
    return this.partnerRepository.find({ where: { active: true } });
  }

  /**
   * Actualiza la URL de webhook de un partner
   */
  async updatePartnerWebhook(apiKey: string, webhookUrl: string): Promise<Partner> {
    const partner = await this.getPartnerByApiKey(apiKey);
    
    if (!partner) {
      throw new Error('Partner no encontrado');
    }

    partner.webhookUrl = webhookUrl;
    return this.partnerRepository.save(partner);
  }
}
