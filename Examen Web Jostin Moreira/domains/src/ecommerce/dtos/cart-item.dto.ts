import { IsUUID, IsNumber, IsOptional, IsArray, ValidateNested, Min, IsString, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CustomizationDataDto {
  @IsUUID()
  customizationId: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  value: string;

  @IsNumber()
  @Min(0)
  additionalPrice: number;
}

export class AddToCartDto {
  @IsUUID()
  cartId: string;

  @IsUUID()
  productId: string;

  @IsUUID()
  @IsOptional()
  variationId?: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CustomizationDataDto)
  @IsOptional()
  customizationData?: CustomizationDataDto[];
}

export class UpdateCartItemDto {
  @IsNumber()
  @Min(1)
  @IsOptional()
  quantity?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CustomizationDataDto)
  @IsOptional()
  customizationData?: CustomizationDataDto[];
}

export class CartItemResponseDto {
  id: string;
  cartId: string;
  productId: string;
  variationId?: string;
  quantity: number;
  unitPrice: number;
  customizationData?: CustomizationDataDto[];
  customizationTotal: number;
  itemTotal: number;
  product: any;
  variation?: any;
  createdAt: Date;
  updatedAt: Date;
}
