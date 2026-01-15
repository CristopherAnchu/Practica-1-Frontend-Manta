import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { Partner } from '../entities/payment.entity';
import { RegisterPartnerDto, PartnerWebhookEvent } from '../dto/partner.dto';

@Injectable()
export class PartnerService {
  constructor(
    @InjectRepository(Partner)
    private partnerRepository: Repository<Partner>,
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

    // Generar firma HMAC
    const signature = this.generateHmacSignature(event, partner.hmacSecret);

    // Enviar webhook (esto debería hacerse de forma asíncrona en producción)
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
        console.error(`Error enviando webhook a ${partner.name}: ${response.statusText}`);
      } else {
        console.log(`✅ Webhook enviado exitosamente a ${partner.name}`);
      }
    } catch (error) {
      console.error(`Error enviando webhook a ${partner.name}:`, error);
    }
  }

  /**
   * Verifica la firma HMAC de un webhook recibido
   */
  verifyHmacSignature(payload: any, signature: string, secret: string): boolean {
    const expectedSignature = this.generateHmacSignature(payload, secret);
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
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
