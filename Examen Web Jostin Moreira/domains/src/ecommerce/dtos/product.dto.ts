import { IsString, IsNumber, IsBoolean, IsOptional, Min, IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  basePrice: number;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  allowsCustomization?: boolean;
}

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  basePrice?: number;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  allowsCustomization?: boolean;
}

export class ProductResponseDto {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  category: string;
  imageUrl: string;
  stock: number;
  isActive: boolean;
  allowsCustomization: boolean;
  variations?: any[];
  customizations?: any[];
  createdAt: Date;
  updatedAt: Date;
}
