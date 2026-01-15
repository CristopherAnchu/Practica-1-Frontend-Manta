import { IsString, IsUrl, IsArray, ArrayMinSize } from 'class-validator';

export class RegisterPartnerDto {
  @IsString()
  name: string;

  @IsUrl()
  webhookUrl: string;

  @IsArray()
  @ArrayMinSize(1)
  subscribedEvents: string[];
}

export class VerifyWebhookDto {
  @IsString()
  apiKey: string;

  payload: any;

  @IsString()
  signature: string;
}

export interface PartnerWebhookEvent {
  eventType: string;
  timestamp: string;
  data: {
    paymentId?: string;
    reservationId?: string;
    userId?: string;
    status?: string;
    amount?: number;
    currency?: string;
    metadata?: Record<string, any>;
  };
}
