import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';

/**
 * Entidad Variation
 * Representa las variaciones de un producto (talla, color)
 */
@Entity('variations')
export class Variation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  productId: string;

  @ManyToOne(() => Product, (product) => product.variations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ type: 'varchar', length: 100 })
  type: string; // 'talla', 'color'

  @Column({ type: 'varchar', length: 100 })
  value: string; // 'S', 'M', 'L', 'XL' o 'Rojo', 'Azul', etc.

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  priceModifier: number; // Incremento o decremento en el precio

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'boolean', default: true })
  isAvailable: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
