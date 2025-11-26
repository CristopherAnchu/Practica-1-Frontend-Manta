export declare class CreateOrderDto {
    userId: string;
    cartId: string;
    paymentMethod: string;
    shippingName: string;
    shippingEmail: string;
    shippingPhone?: string;
    shippingAddress: string;
    shippingCity: string;
    shippingCountry: string;
    shippingPostalCode: string;
    notes?: string;
}
export declare class UpdateOrderStatusDto {
    status: string;
    adminNotes?: string;
}
export declare class UpdatePaymentStatusDto {
    paymentStatus: string;
}
export declare class OrderResponseDto {
    id: string;
    orderNumber: string;
    userId: string;
    items: any[];
    subtotal: number;
    tax: number;
    shippingCost: number;
    processingFee: number;
    total: number;
    paymentMethod: string;
    status: string;
    paymentStatus: string;
    shippingName: string;
    shippingEmail: string;
    shippingPhone?: string;
    shippingAddress: string;
    shippingCity: string;
    shippingCountry: string;
    shippingPostalCode: string;
    notes?: string;
    adminNotes?: string;
    createdAt: Date;
    updatedAt: Date;
    confirmedAt?: Date;
    shippedAt?: Date;
    deliveredAt?: Date;
}
