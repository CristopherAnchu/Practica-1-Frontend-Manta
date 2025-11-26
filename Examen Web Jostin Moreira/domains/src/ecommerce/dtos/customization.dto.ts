import { IsString, IsNumber, IsBoolean, IsOptional, IsUUID, IsInt, Min, IsNotEmpty } from 'class-validator';

export class CreateCustomizationDto {
  @IsUUID()
  productId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  additionalPrice?: number;

  @IsInt()
  @IsOptional()
  maxCharacters?: number;
}

export class UpdateCustomizationDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  additionalPrice?: number;

  @IsInt()
  @IsOptional()
  maxCharacters?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class CustomizationResponseDto {
  id: string;
  productId: string;
  name: string;
  description: string;
  type: string;
  additionalPrice: number;
  maxCharacters?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
