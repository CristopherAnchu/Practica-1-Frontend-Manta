import { Injectable } from '@nestjs/common';
import {
  PaymentProvider,
  CreatePaymentData,
  PaymentIntentResponse,
  PaymentStatusResponse,
  RefundResponse,
  NormalizedWebhookEvent,
  PaymentStatus,
  RefundStatus,
  WebhookEventType,
} from '../interfaces/payment-provider.interface';

/**
 * Mock Adapter - Simula pasarela de pago para desarrollo
 */
@Injectable()
export class MockPaymentAdapter implements PaymentProvider {
  private payments: Map<string, any> = new Map();

  async createPaymentIntent(data: CreatePaymentData): Promise<PaymentIntentResponse> {
    const paymentId = `mock_pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const payment = {
      id: paymentId,
      status: PaymentStatus.PENDING,
      amount: data.amount,
      currency: data.currency,
      description: data.description,
      metadata: data.metadata,
      createdAt: new Date(),
    };

    this.payments.set(paymentId, payment);

    return {
      id: paymentId,
      status: PaymentStatus.PENDING,
      amount: data.amount,
      currency: data.currency,
      clientSecret: `mock_secret_${paymentId}`,
      providerData: payment,
    };
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentStatusResponse> {
    const payment = this.payments.get(paymentId);

    if (!payment) {
      throw new Error('Pago no encontrado');
    }

    return {
      id: payment.id,
      status: payment.status,
      amount: payment.amount,
      currency: payment.currency,
      paidAt: payment.paidAt,
      metadata: payment.metadata,
    };
  }

  async processWebhook(payload: any, signature?: string): Promise<NormalizedWebhookEvent> {
    // Simular procesamiento de webhook
    return {
      eventType: WebhookEventType.PAYMENT_SUCCEEDED,
      paymentId: payload.paymentId || 'mock_payment_id',
      amount: payload.amount || 1000,
      currency: payload.currency || 'USD',
      status: PaymentStatus.SUCCEEDED,
      metadata: payload.metadata,
      timestamp: new Date(),
      provider: 'mock',
      rawData: payload,
    };
  }

  async refundPayment(paymentId: string, amount?: number): Promise<RefundResponse> {
    const payment = this.payments.get(paymentId);

    if (!payment) {
      throw new Error('Pago no encontrado');
    }

    const refundId = `mock_re_${Date.now()}`;

    return {
      id: refundId,
      paymentId,
      amount: amount || payment.amount,
      status: RefundStatus.SUCCEEDED,
    };
  }

  /**
   * Método auxiliar para simular confirmación de pago (solo para testing)
   */
  async simulatePaymentSuccess(paymentId: string): Promise<void> {
    const payment = this.payments.get(paymentId);
    if (payment) {
      payment.status = PaymentStatus.SUCCEEDED;
      payment.paidAt = new Date();
      this.payments.set(paymentId, payment);
    }
  }

  /**
   * Método auxiliar para simular fallo de pago (solo para testing)
   */
  async simulatePaymentFailure(paymentId: string): Promise<void> {
    const payment = this.payments.get(paymentId);
    if (payment) {
      payment.status = PaymentStatus.FAILED;
      this.payments.set(paymentId, payment);
    }
  }
}
