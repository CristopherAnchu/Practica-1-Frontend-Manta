import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentProvider } from '../interfaces/payment-provider.interface';
import { MockPaymentAdapter } from '../adapters/mock-payment.adapter';
import { StripeAdapter } from '../adapters/stripe.adapter';
import { Payment, WebhookEvent } from '../entities/payment.entity';
import { CreatePaymentDto } from '../dto/payment.dto';
import { PartnerService } from './partner.service';

@Injectable()
export class PaymentService {
  private paymentProvider: PaymentProvider;

  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(WebhookEvent)
    private webhookEventRepository: Repository<WebhookEvent>,
    private partnerService: PartnerService,
  ) {
    // Seleccionar adapter según configuración
    const useMock = process.env.USE_MOCK_ADAPTER === 'true';
    this.paymentProvider = useMock ? new MockPaymentAdapter() : new StripeAdapter();
    
    console.log(`💳 Payment Service usando: ${useMock ? 'MockAdapter' : 'StripeAdapter'}`);
  }

  /**
   * Crea un nuevo pago
   */
  async createPayment(dto: CreatePaymentDto): Promise<any> {
    // Crear intención de pago con el provider
    const paymentIntent = await this.paymentProvider.createPaymentIntent({
      amount: dto.amount,
      currency: dto.currency || 'USD',
      description: dto.description,
      metadata: dto.metadata,
      customerEmail: dto.customerEmail,
    });

    // Guardar en BD
    const payment = this.paymentRepository.create({
      providerPaymentId: paymentIntent.id,
      provider: process.env.USE_MOCK_ADAPTER === 'true' ? 'mock' : 'stripe',
      amount: dto.amount / 100, // Convertir de centavos a dólares
      currency: dto.currency || 'USD',
      status: paymentIntent.status,
      description: dto.description,
      metadata: dto.metadata,
      userId: dto.userId,
      reservationId: dto.reservationId,
    });

    await this.paymentRepository.save(payment);

    return {
      paymentId: payment.id,
      providerPaymentId: paymentIntent.id,
      status: paymentIntent.status,
      amount: payment.amount,
      currency: payment.currency,
      clientSecret: paymentIntent.clientSecret,
    };
  }

  /**
   * Obtiene el estado de un pago
   */
  async getPaymentStatus(paymentId: string): Promise<any> {
    const payment = await this.paymentRepository.findOne({ where: { id: paymentId } });

    if (!payment) {
      throw new Error('Pago no encontrado');
    }

    return {
      id: payment.id,
      providerPaymentId: payment.providerPaymentId,
      status: payment.status,
      amount: payment.amount,
      currency: payment.currency,
      paidAt: payment.paidAt,
      createdAt: payment.createdAt,
    };
  }

  /**
   * Procesa un webhook de la pasarela de pago
   */
  async processPaymentWebhook(payload: any, signature?: string): Promise<void> {
    // Normalizar webhook usando el adapter
    const normalizedEvent = await this.paymentProvider.processWebhook(payload, signature);

    // Guardar evento
    const webhookEvent = this.webhookEventRepository.create({
      eventType: normalizedEvent.eventType,
      paymentId: normalizedEvent.paymentId,
      payload: normalizedEvent.rawData,
      provider: normalizedEvent.provider,
    });

    await this.webhookEventRepository.save(webhookEvent);

    // Actualizar pago en BD
    const payment = await this.paymentRepository.findOne({
      where: { providerPaymentId: normalizedEvent.paymentId },
    });

    if (payment) {
      payment.status = normalizedEvent.status;
      if (normalizedEvent.status === 'succeeded') {
        payment.paidAt = new Date();
      }
      await this.paymentRepository.save(payment);

      // Notificar a partners interesados
      await this.notifyPartners(normalizedEvent.eventType, payment);
    }

    // Marcar evento como procesado
    webhookEvent.processed = true;
    webhookEvent.processedAt = new Date();
    await this.webhookEventRepository.save(webhookEvent);
  }

  /**
   * Notifica a partners sobre eventos de pago
   */
  private async notifyPartners(eventType: string, payment: Payment): Promise<void> {
    const partners = await this.partnerService.getAllPartners();

    const partnerEvent = {
      eventType: `payment.${eventType.split('.')[1]}`,
      timestamp: new Date().toISOString(),
      data: {
        paymentId: payment.id,
        reservationId: payment.reservationId,
        userId: payment.userId,
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency,
        metadata: payment.metadata,
      },
    };

    for (const partner of partners) {
      try {
        await this.partnerService.sendWebhookToPartner(partner.id, partnerEvent);
      } catch (error) {
        console.error(`Error notificando a partner ${partner.name}:`, error);
      }
    }
  }

  /**
   * Lista todos los pagos
   */
  async getAllPayments(): Promise<Payment[]> {
    return this.paymentRepository.find({
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }
}
