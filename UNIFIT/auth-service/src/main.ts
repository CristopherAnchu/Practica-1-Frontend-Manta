import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  });

  // Validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`🔐 Auth Service corriendo en: http://localhost:${port}`);
  console.log(`📋 Endpoints disponibles:`);
  console.log(`   POST http://localhost:${port}/auth/register`);
  console.log(`   POST http://localhost:${port}/auth/login`);
  console.log(`   POST http://localhost:${port}/auth/refresh`);
  console.log(`   POST http://localhost:${port}/auth/logout`);
  console.log(`   GET  http://localhost:${port}/auth/me`);
  console.log(`   GET  http://localhost:${port}/auth/validate`);
}

bootstrap();
