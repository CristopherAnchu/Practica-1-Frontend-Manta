import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar validación global con class-validator
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Habilitar CORS
  app.enableCors();

  // Prefijo global para todas las rutas
  app.setGlobalPrefix('api');

  await app.listen(3000);
  console.log(`🚀 REST API corriendo en: http://localhost:3000/api`);
}
bootstrap();
