import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors({
    origin: '*', // En producción, especificar dominios permitidos
    credentials: true,
  });

  // Validación global de inputs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 4000;
  await app.listen(port);

  console.log(`🚀 Servidor GraphQL corriendo en: http://localhost:${port}/graphql`);
  console.log(`📊 Apollo Playground disponible en: http://localhost:${port}/graphql`);
}

bootstrap();
