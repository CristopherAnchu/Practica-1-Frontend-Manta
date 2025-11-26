export declare class CreateVariationDto {
    productId: string;
    type: string;
    value: string;
    priceModifier?: number;
    stock?: number;
}
export declare class UpdateVariationDto {
    type?: string;
    value?: string;
    priceModifier?: number;
    stock?: number;
    isAvailable?: boolean;
}
export declare class VariationResponseDto {
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
