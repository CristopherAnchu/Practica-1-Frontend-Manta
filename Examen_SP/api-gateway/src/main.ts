import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const port = process.env.PORT || 3003;

  const app = await NestFactory.create(AppModule);
  
  // CORS
  app.enableCors();

  await app.listen(port);
  
  logger.log(`API Gateway iniciado en puerto ${port}`);
  logger.log(`Chat endpoint: POST http://localhost:${port}/chat`);
}

bootstrap();
