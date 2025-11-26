import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Product,
  Variation,
  Customization,
  Cart,
  CartItem,
  Order,
} from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Variation,
      Customization,
      Cart,
      CartItem,
      Order,
    ]),
  ],
  exports: [
    TypeOrmModule, // Exportar TypeOrmModule para acceso directo a repositorios
  ],
})
export class EcommerceModule {}
