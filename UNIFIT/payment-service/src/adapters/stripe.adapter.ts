import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
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
 * Stripe Adapter - Integración real con Stripe
 */
@Injectable()
export class StripeAdapter implements PaymentProvider {
  private stripe: Stripe;

  constructor() {
    const apiKey = process.env.STRIPE_SECRET_KEY || '';
    this.stripe = new Stripe(apiKey, {
      apiVersion: '2023-10-16',
    });
  }

  async createPaymentIntent(data: CreatePaymentData): Promise<PaymentIntentResponse> {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: data.amount,
      currency: data.currency,
      description: data.description,
      metadata: data.metadata || {},
      receipt_email: data.customerEmail,
    });

    return {
      id: paymentIntent.id,
      status: this.mapStripeStatus(paymentIntent.status),
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      clientSecret: paymentIntent.client_secret || undefined,
      providerData: paymentIntent,
    };
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentStatusResponse> {
    const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentId);

    return {
      id: paymentIntent.id,
      status: this.mapStripeStatus(paymentIntent.status),
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      paidAt: paymentIntent.created ? new Date(paymentIntent.created * 1000) : undefined,
      metadata: paymentIntent.metadata,
    };
  }

  async processWebhook(payload: any, signature: string): Promise<NormalizedWebhookEvent> {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
    
    // Verificar firma del webhook
    const event = this.stripe.webhooks.constructEvent(
      JSON.stringify(payload),
      signature,
      webhookSecret,
    );

    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    return {
      eventType: this.mapStripeEventType(event.type),
      paymentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: this.mapStripeStatus(paymentIntent.status),
      metadata: paymentIntent.metadata,
      timestamp: new Date(event.created * 1000),
      provider: 'stripe',
      rawData: event,
    };
  }

  async refundPayment(paymentId: string, amount?: number): Promise<RefundResponse> {
    const refund = await this.stripe.refunds.create({
      payment_intent: paymentId,
      amount,
    });

    return {
      id: refund.id,
      paymentId,
      amount: refund.amount,
      status: this.mapRefundStatus(refund.status),
    };
  }

  /**
   * Mapea estados de Stripe a estados normalizados
   */
  private mapStripeStatus(status: string): PaymentStatus {
    const statusMap: Record<string, PaymentStatus> = {
      'requires_payment_method': PaymentStatus.PENDING,
      'requires_confirmation': PaymentStatus.PENDING,
      'requires_action': PaymentStatus.PENDING,
      'processing': PaymentStatus.PROCESSING,
      'succeeded': PaymentStatus.SUCCEEDED,
      'canceled': PaymentStatus.CANCELLED,
      'requires_capture': PaymentStatus.PROCESSING,
    };

    return statusMap[status] || PaymentStatus.FAILED;
  }

  /**
   * Mapea eventos de Stripe a eventos normalizados
   */
  private mapStripeEventType(eventType: string): WebhookEventType {
    const eventMap: Record<string, WebhookEventType> = {
      'payment_intent.created': WebhookEventType.PAYMENT_CREATED,
      'payment_intent.succeeded': WebhookEventType.PAYMENT_SUCCEEDED,
      'payment_intent.payment_failed': WebhookEventType.PAYMENT_FAILED,
      'payment_intent.canceled': WebhookEventType.PAYMENT_CANCELLED,
      'charge.refunded': WebhookEventType.REFUND_SUCCEEDED,
    };

    return eventMap[eventType] || WebhookEventType.PAYMENT_CREATED;
  }

  /**
   * Mapea estados de reembolso
   */
  private mapRefundStatus(status: string): RefundStatus {
    const statusMap: Record<string, RefundStatus> = {
      'pending': RefundStatus.PENDING,
      'succeeded': RefundStatus.SUCCEEDED,
      'failed': RefundStatus.FAILED,
      'canceled': RefundStatus.FAILED,
    };

    return statusMap[status] || RefundStatus.FAILED;
  }
}
