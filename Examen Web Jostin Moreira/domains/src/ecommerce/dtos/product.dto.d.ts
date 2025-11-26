export declare class CreateProductDto {
    name: string;
    description: string;
    basePrice: number;
    category: string;
    imageUrl?: string;
    stock?: number;
    allowsCustomization?: boolean;
}
export declare class UpdateProductDto {
    name?: string;
    description?: string;
    basePrice?: number;
    category?: string;
    imageUrl?: string;
    stock?: number;
    isActive?: boolean;
    allowsCustomization?: boolean;
}
export declare class ProductResponseDto {
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
