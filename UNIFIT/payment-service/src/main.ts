import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  // Necesitamos el raw body para verificar firmas de webhooks (Stripe/HMAC)
  const app = await NestFactory.create(AppModule);

  // Raw body solo para la ruta de webhook de pagos
  app.use('/payments/webhook', bodyParser.raw({ type: '*/*' }));

  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3002;
  await app.listen(port);

  console.log(`💳 Payment Service corriendo en: http://localhost:${port}`);
  console.log(`📋 Endpoints:`);
  console.log(`   POST http://localhost:${port}/payments - Crear pago`);
  console.log(`   GET  http://localhost:${port}/payments/:id - Estado de pago`);
  console.log(`   POST http://localhost:${port}/payments/webhook - Webhook pasarela`);
  console.log(`   POST http://localhost:${port}/partners/register - Registrar partner`);
  console.log(`   POST http://localhost:${port}/partners/webhook - Recibir webhook partner`);
}

bootstrap();
