import { Variation } from './variation.entity';
import { Customization } from './customization.entity';
export declare class Product {
    id: string;
    name: string;
    description: string;
    basePrice: number;
    category: string;
    imageUrl: string;
    stock: number;
    isActive: boolean;
    allowsCustomization: boolean;
    variations: Variation[];
    customizations: Customization[];
    createdAt: Date;
    updatedAt: Date;
}
