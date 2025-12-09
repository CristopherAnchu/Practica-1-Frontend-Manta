export declare class CreateCustomizationDto {
    productId: string;
    name: string;
    description: string;
    type: string;
    additionalPrice?: number;
    maxCharacters?: number;
}
export declare class UpdateCustomizationDto {
    name?: string;
    description?: string;
    type?: string;
    additionalPrice?: number;
    maxCharacters?: number;
    isActive?: boolean;
}
export declare class CustomizationResponseDto {
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
