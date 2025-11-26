export declare class CustomizationDataDto {
    customizationId: string;
    type: string;
    value: string;
    additionalPrice: number;
}
export declare class AddToCartDto {
    cartId: string;
    productId: string;
    variationId?: string;
    quantity: number;
    customizationData?: CustomizationDataDto[];
}
export declare class UpdateCartItemDto {
    quantity?: number;
    customizationData?: CustomizationDataDto[];
}
export declare class CartItemResponseDto {
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
