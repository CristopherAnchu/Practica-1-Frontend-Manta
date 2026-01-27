import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { Exam2PAuditLog } from './entities/exam2p-audit-log.entity';
import { AuditService } from './services/audit.service';
import { WebhookEmitterService } from './services/webhook-emitter.service';
import { AuditController } from './controllers/audit.controller';
import { RabbitMQController } from './controllers/rabbitmq.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5433,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'exam2p_audit',
      entities: [Exam2PAuditLog],
      synchronize: true,
      logging: true,
    }),
    TypeOrmModule.forFeature([Exam2PAuditLog]),
    HttpModule,
  ],
  controllers: [AuditController, RabbitMQController],
  providers: [AuditService, WebhookEmitterService],
})
export class AppModule {}
