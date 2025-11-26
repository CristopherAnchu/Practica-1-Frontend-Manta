import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Entidad Order (Simplificada)
 * Representa un pedido/compra finalizada
 */
@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  orderNumber: string; // Número de orden único (ej: ORD-20250125-0001)

  @Column({ type: 'uuid' })
  userId: string; // Referencia externa al usuario

  // Items del pedido (snapshot en JSON)
  @Column({ type: 'json' })
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

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  tax: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  shippingCost: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  processingFee: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  // Método de pago simplificado
  @Column({ type: 'varchar', length: 50 })
  paymentMethod: string; // 'credit_card', 'paypal', 'bank_transfer', 'cash'

  @Column({ type: 'varchar', length: 50, default: 'pending' })
  status: string; // 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'

  @Column({ type: 'varchar', length: 50, default: 'pending' })
  paymentStatus: string; // 'pending', 'paid', 'failed', 'refunded'

  // Datos de envío (snapshot)
  @Column({ type: 'varchar', length: 255 })
  shippingName: string;

  @Column({ type: 'varchar', length: 255 })
  shippingEmail: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  shippingPhone: string;

  @Column({ type: 'text' })
  shippingAddress: string;

  @Column({ type: 'varchar', length: 100 })
  shippingCity: string;

  @Column({ type: 'varchar', length: 100 })
  shippingCountry: string;

  @Column({ type: 'varchar', length: 20 })
  shippingPostalCode: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', nullable: true })
  adminNotes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  confirmedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  shippedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  deliveredAt: Date;
}
