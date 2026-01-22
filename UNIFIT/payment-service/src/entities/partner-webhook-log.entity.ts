import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

export enum WebhookDirection {
  OUTBOUND = 'outbound',
  INBOUND = 'inbound',
}

@Entity('partner_webhook_logs')
export class PartnerWebhookLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'partner_id', type: 'uuid', nullable: true })
  partnerId: string | null;

  @Column({ type: 'varchar', length: 16 })
  direction: WebhookDirection;

  @Column({ name: 'event_type', type: 'varchar', length: 255 })
  eventType: string;

  @Column({ type: 'jsonb' })
  payload: Record<string, any>;

  @Column({ type: 'varchar', length: 512, nullable: true })
  signature: string | null;

  @Column({ type: 'boolean', default: true })
  valid: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
