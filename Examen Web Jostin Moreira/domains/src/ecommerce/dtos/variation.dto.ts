import { IsString, IsNumber, IsBoolean, IsOptional, IsUUID, Min, IsNotEmpty } from 'class-validator';

export class CreateVariationDto {
  @IsUUID()
  productId: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  value: string;

  @IsNumber()
  @IsOptional()
  priceModifier?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;
}

export class UpdateVariationDto {
  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  value?: string;

  @IsNumber()
  @IsOptional()
  priceModifier?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}

export class VariationResponseDto {
  id: string;
  productId: string;
  type: string;
  value: string;
  priceModifier: number;
  stock: number;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}
