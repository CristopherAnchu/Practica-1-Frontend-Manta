export declare class CreateCartDto {
    userId?: string;
    sessionId?: string;
}
export declare class CartResponseDto {
    id: string;
    userId?: string;
    sessionId?: string;
    items: any[];
    subtotal: number;
    tax: number;
    total: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
