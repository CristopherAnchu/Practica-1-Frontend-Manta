import { Controller, Get, Query, Logger } from '@nestjs/common';
import { AuditService } from '../services/audit.service';
import { Exam2PAuditLog } from '../entities/exam2p-audit-log.entity';

@Controller('exam2p-audit')
export class AuditController {
  private readonly logger = new Logger(AuditController.name);

  constructor(private readonly auditService: AuditService) {}

  @Get()
  async getAuditRecords(
    @Query('limit') limit?: string
  ): Promise<Exam2PAuditLog[]> {
    this.logger.log(`GET /exam2p-audit - Limit: ${limit || 'not specified'}`);
    
    const limitNumber = limit ? parseInt(limit, 10) : undefined;
    return await this.auditService.getAllRecords(limitNumber);
  }
}
