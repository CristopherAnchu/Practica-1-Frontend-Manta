import { IsUUID, IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  cartId: string;

  @IsString()
  @IsNotEmpty()
  paymentMethod: string; // 'credit_card', 'paypal', 'bank_transfer', 'cash'

  @IsString()
  @IsNotEmpty()
  shippingName: string;

  @IsString()
  @IsNotEmpty()
  shippingEmail: string;

  @IsString()
  @IsOptional()
  shippingPhone?: string;

  @IsString()
  @IsNotEmpty()
  shippingAddress: string;

  @IsString()
  @IsNotEmpty()
  shippingCity: string;

  @IsString()
  @IsNotEmpty()
  shippingCountry: string;

  @IsString()
  @IsNotEmpty()
  shippingPostalCode: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateOrderStatusDto {
  @IsString()
  @IsNotEmpty()
  status: string; // 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'

  @IsString()
  @IsOptional()
  adminNotes?: string;
}

export class UpdatePaymentStatusDto {
  @IsString()
  @IsNotEmpty()
  paymentStatus: string; // 'pending', 'paid', 'failed', 'refunded'
}

export class OrderResponseDto {
  id: string;
  orderNumber: string;
  userId: string;
  items: any[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  processingFee: number;
  total: number;
  paymentMethod: string;
  status: string;
  paymentStatus: string;
  shippingName: string;
  shippingEmail: string;
  shippingPhone?: string;
  shippingAddress: string;
  shippingCity: string;
  shippingCountry: string;
  shippingPostalCode: string;
  notes?: string;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
  confirmedAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
}
