import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { VariationsModule } from './variations/variations.module';
import { CustomizationsModule } from './customizations/customizations.module';
import { CartsModule } from './carts/carts.module';
import { OrdersModule } from './orders/orders.module';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DB_DATABASE || 'ecommerce.db',
      entities: [__dirname + '/../../domains/**/*.entity{.ts,.js}'],
      synchronize: true, // Solo para desarrollo
      logging: false,
    }),
    ProductsModule,
    VariationsModule,
    CustomizationsModule,
    CartsModule,
    OrdersModule,
    WebsocketModule,
  ],
})
export class AppModule {}
