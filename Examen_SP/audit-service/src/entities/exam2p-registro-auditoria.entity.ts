import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('audit_records')
export class AuditRecord {
  @PrimaryGeneratedColumn()
  recordId: number;

  @Column({ type: 'varchar', length: 255 })
  entity: string;

  @Column({ type: 'integer' })
  affectedRecordId: number;

  @Column({ type: 'varchar', length: 50 })
  action: string; // "CREATE" | "UPDATE" | "DELETE"

  @Column({ type: 'varchar', length: 255 })
  user: string;

  @CreateDateColumn({ type: 'timestamp' })
  timestamp: Date;

  @Column({ type: 'text', nullable: true })
  details: string;
}
