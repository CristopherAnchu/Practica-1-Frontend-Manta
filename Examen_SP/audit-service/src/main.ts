import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const port = process.env.PORT || 3000;

  // Create hybrid application (HTTP + RabbitMQ)
  const app = await NestFactory.create(AppModule);

  // Configure RabbitMQ microservice
  const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672';
  
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitmqUrl],
      queue: 'exam2p.record.deleted',
      queueOptions: {
        durable: true,
      },
      noAck: false,
    },
  });

  // Start RabbitMQ microservice
  await app.startAllMicroservices();
  logger.log('RabbitMQ microservice started');
  logger.log(`Listening on queue: exam2p.record.deleted`);

  // Start HTTP server
  await app.listen(port);
  logger.log(`HTTP server started on port ${port}`);
  logger.log(`REST Endpoint: GET http://localhost:${port}/exam2p-audit`);
}

bootstrap();
