import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Variation } from './variation.entity';
import { Customization } from './customization.entity';

/**
 * Entidad Product
 * Representa los productos base de la tienda (camisetas, tazas, libretas)
 */
@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  basePrice: number;

  @Column({ type: 'varchar', length: 100 })
  category: string; // 'camiseta', 'taza', 'libreta'

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl: string;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: true })
  allowsCustomization: boolean;

  @OneToMany(() => Variation, (variation) => variation.product, {
    cascade: true,
  })
  variations: Variation[];

  @OneToMany(() => Customization, (customization) => customization.product, {
    cascade: true,
  })
  customizations: Customization[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
