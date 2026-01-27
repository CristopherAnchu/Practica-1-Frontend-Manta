import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exam2PAuditLog } from '../entities/exam2p-audit-log.entity';
import { CreateAuditRecordDto } from '../dto/create-audit-record.dto';
import { WebhookEmitterService } from './webhook-emitter.service';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    @InjectRepository(Exam2PAuditLog)
    private readonly auditRepository: Repository<Exam2PAuditLog>,
    private readonly webhookEmitterService: WebhookEmitterService,
  ) {}

  async createAuditRecord(dto: CreateAuditRecordDto): Promise<Exam2PAuditLog> {
    this.logger.log(`Creating audit record: ${JSON.stringify(dto)}`);

    const record = this.auditRepository.create(dto);
    const savedRecord = await this.auditRepository.save(record);

    this.logger.log(`Audit record created with ID: ${savedRecord.logId}`);

    // Emit webhook to n8n when action is "DELETE"
    if (dto.exam2p_action === 'DELETE') {
      this.logger.log('DELETE action detected, emitting webhook...');
      await this.webhookEmitterService.emitWebhook(savedRecord);
    }

    return savedRecord;
  }

  async getAllRecords(limit?: number): Promise<Exam2PAuditLog[]> {
    this.logger.log(`Getting audit records. Limit: ${limit || 'all'}`);

    const queryBuilder = this.auditRepository
      .createQueryBuilder('audit')
      .orderBy('audit.exam2p_timestamp', 'DESC');

    if (limit && limit > 0) {
      queryBuilder.take(limit);
    }

    return await queryBuilder.getMany();
  }

  async processRabbitMQEvent(message: any): Promise<void> {
    this.logger.log(`Processing RabbitMQ event: ${JSON.stringify(message)}`);

    try {
      const dto: CreateAuditRecordDto = {
        exam2p_entity: message.entity || 'Unknown',
        exam2p_recordId: message.recordId || 0,
        exam2p_action: message.action || 'DELETE',
        exam2p_user: message.user || 'System',
        exam2p_detail: message.detail || 'Record deleted from RabbitMQ event'
      };

      await this.createAuditRecord(dto);
      this.logger.log('Event processed and saved to DB successfully');
    } catch (error) {
      this.logger.error(`Error processing RabbitMQ event: ${error.message}`, error.stack);
      throw error;
    }
  }
}
