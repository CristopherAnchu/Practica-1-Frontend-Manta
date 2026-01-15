/**
 * Interface abstracta para proveedores de pago (Patrón Adapter)
 */
export interface PaymentProvider {
  /**
   * Crea una intención de pago
   */
  createPaymentIntent(data: CreatePaymentData): Promise<PaymentIntentResponse>;

  /**
   * Verifica el estado de un pago
   */
  getPaymentStatus(paymentId: string): Promise<PaymentStatusResponse>;

  /**
   * Procesa un webhook de la pasarela
   */
  processWebhook(payload: any, signature?: string): Promise<NormalizedWebhookEvent>;

  /**
   * Reembolsa un pago
   */
  refundPayment(paymentId: string, amount?: number): Promise<RefundResponse>;
}

export interface CreatePaymentData {
  amount: number; // en centavos
  currency: string;
  description: string;
  metadata?: Record<string, any>;
  customerEmail?: string;
}

export interface PaymentIntentResponse {
  id: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  clientSecret?: string;
  providerData?: any;
}

export interface PaymentStatusResponse {
  id: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  paidAt?: Date;
  metadata?: Record<string, any>;
}

export interface RefundResponse {
  id: string;
  paymentId: string;
  amount: number;
  status: RefundStatus;
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum RefundStatus {
  PENDING = 'pending',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
}

/**
 * Formato normalizado de eventos de webhook
 */
export interface NormalizedWebhookEvent {
  eventType: WebhookEventType;
  paymentId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  metadata?: Record<string, any>;
  timestamp: Date;
  provider: string;
  rawData?: any;
}

export enum WebhookEventType {
  PAYMENT_CREATED = 'payment.created',
  PAYMENT_SUCCEEDED = 'payment.succeeded',
  PAYMENT_FAILED = 'payment.failed',
  PAYMENT_CANCELLED = 'payment.cancelled',
  REFUND_CREATED = 'refund.created',
  REFUND_SUCCEEDED = 'refund.succeeded',
}
