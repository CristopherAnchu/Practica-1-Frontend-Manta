import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Payment, Partner, WebhookEvent } from './entities/payment.entity';
import { PaymentService } from './services/payment.service';
import { PartnerService } from './services/partner.service';
import { PaymentController } from './controllers/payment.controller';
import { PartnerController } from './controllers/partner.controller';
import { MockPaymentAdapter } from './adapters/mock-payment.adapter';
import { StripeAdapter } from './adapters/stripe.adapter';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [Payment, Partner, WebhookEvent],
      synchronize: true,
      ssl: false,
      logging: ['error', 'warn'],
    }),
    TypeOrmModule.forFeature([Payment, Partner, WebhookEvent]),
  ],
  controllers: [PaymentController, PartnerController],
  providers: [PaymentService, PartnerService, MockPaymentAdapter, StripeAdapter],
})
export class AppModule {}
