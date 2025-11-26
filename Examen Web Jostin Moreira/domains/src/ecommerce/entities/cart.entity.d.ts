import { CartItem } from './cart-item.entity';
export declare class Cart {
    id: string;
    userId: string;
    sessionId: string;
    items: CartItem[];
    subtotal: number;
    tax: number;
    total: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
