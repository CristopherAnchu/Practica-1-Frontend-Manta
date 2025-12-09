export declare class Order {
    id: string;
    orderNumber: string;
    userId: string;
    items: {
        productId: string;
        productName: string;
        productCategory: string;
        productImage?: string;
        variationData?: {
            type: string;
            value: string;
            priceModifier: number;
        };
        quantity: number;
        unitPrice: number;
        customizationData?: {
            customizationId: string;
            name: string;
            type: string;
            value: string;
            additionalPrice: number;
        }[];
        customizationTotal: number;
        itemTotal: number;
    }[];
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
    shippingPhone: string;
    shippingAddress: string;
    shippingCity: string;
    shippingCountry: string;
    shippingPostalCode: string;
    notes: string;
    adminNotes: string;
    createdAt: Date;
    updatedAt: Date;
    confirmedAt: Date;
    shippedAt: Date;
    deliveredAt: Date;
}
