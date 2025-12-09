import { Product } from './product.entity';
export declare class Customization {
    id: string;
    productId: string;
    product: Product;
    name: string;
    description: string;
    type: string;
    additionalPrice: number;
    maxCharacters: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
