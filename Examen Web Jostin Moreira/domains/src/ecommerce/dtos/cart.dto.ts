import { IsString, IsUUID, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateCartDto {
  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  sessionId?: string;
}

export class CartResponseDto {
  id: string;
  userId?: string;
  sessionId?: string;
  items: any[];
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
