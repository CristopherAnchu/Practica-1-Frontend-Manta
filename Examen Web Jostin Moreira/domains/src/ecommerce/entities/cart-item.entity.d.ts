import { Cart } from './cart.entity';
import { Product } from './product.entity';
import { Variation } from './variation.entity';
export declare class CartItem {
    id: string;
    cartId: string;
    cart: Cart;
    productId: string;
    product: Product;
    variationId: string;
    variation: Variation;
    quantity: number;
    unitPrice: number;
    customizationData: {
        customizationId: string;
        type: string;
        value: string;
        additionalPrice: number;
    }[];
    customizationTotal: number;
    itemTotal: number;
    createdAt: Date;
    updatedAt: Date;
}
