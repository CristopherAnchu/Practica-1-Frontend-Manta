import { IsNumber, IsString, IsOptional, IsEmail, IsUUID, Min } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  @Min(50) // Mínimo 50 centavos
  amount: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  description: string;

  @IsOptional()
  metadata?: Record<string, any>;

  @IsEmail()
  @IsOptional()
  customerEmail?: string;

  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsUUID()
  @IsOptional()
  reservationId?: string;
}
