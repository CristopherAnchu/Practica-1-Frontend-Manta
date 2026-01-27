import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('exam2p_audit_logs')
export class Exam2PAuditLog {
  @PrimaryGeneratedColumn()
  logId: number;

  @Column({ type: 'varchar', length: 255 })
  exam2p_entity: string;

  @Column({ type: 'integer' })
  exam2p_recordId: number;

  @Column({ type: 'varchar', length: 50 })
  exam2p_action: string; // "CREATE" | "UPDATE" | "DELETE"

  @Column({ type: 'varchar', length: 255 })
  exam2p_user: string;

  @CreateDateColumn({ type: 'timestamp' })
  exam2p_timestamp: Date;

  @Column({ type: 'text', nullable: true })
  exam2p_detail: string;
}
