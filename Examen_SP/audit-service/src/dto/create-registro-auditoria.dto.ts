export class CreateAuditRecordDto {
  entity: string;
  affectedRecordId: number;
  action: string;
  user: string;
  details?: string;
}
