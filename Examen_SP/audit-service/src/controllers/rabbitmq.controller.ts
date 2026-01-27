import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AuditService } from '../services/audit.service';

@Controller()
export class RabbitMQController {
  constructor(private readonly auditService: AuditService) {}

  @EventPattern('exam2p.record.deleted')
  async handleRecordDeleted(@Payload() message: any) {
    await this.auditService.processRabbitMQEvent(message);
  }
}
