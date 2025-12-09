import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CartItem } from './cart-item.entity';

/**
 * Entidad Cart
 * Representa el carrito de compras de un usuario
 */
@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  userId: string; // ID del usuario propietario del carrito (referencia externa)

  @Column({ type: 'varchar', length: 255, nullable: true })
  sessionId: string; // Para carritos de sesión (usuarios no autenticados)

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, {
    cascade: true,
    eager: true,
  })
  items: CartItem[];

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  tax: number; // Impuestos

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total: number;

  @Column({ type: 'varchar', length: 50, default: 'active' })
  status: string; // 'active', 'abandoned', 'converted'

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
