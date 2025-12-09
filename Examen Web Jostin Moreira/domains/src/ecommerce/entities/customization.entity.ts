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
 * Entidad Customization
 * Representa las opciones de personalización disponibles para cada producto
 */
@Entity('customizations')
export class Customization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  productId: string;

  @ManyToOne(() => Product, (product) => product.customizations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ type: 'varchar', length: 255 })
  name: string; // 'Texto personalizado', 'Imagen personalizada', 'Logo'

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 100 })
  type: string; // 'text', 'image', 'logo'

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  additionalPrice: number; // Precio adicional por personalización

  @Column({ type: 'int', nullable: true })
  maxCharacters: number; // Para personalizaciones de texto

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
