import { Product } from './product.entity';
export declare class Variation {
    id: string;
    productId: string;
    product: Product;
    type: string;
    value: string;
    priceModifier: number;
    stock: number;
    isAvailable: boolean;
    createdAt: Date;
    updatedAt: Date;
}
