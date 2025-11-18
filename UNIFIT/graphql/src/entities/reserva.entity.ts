import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Usuario } from './usuario.entity';

@ObjectType()
@Entity('reservas') // Mapear a la tabla 'reservas' de Golang
export class Reserva {
  @Field(() => ID)
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Field()
  @Column({ name: 'usuarioId', type: 'uuid' })
  usuarioId: string;

  @Field({ nullable: true })
  @Column({ name: 'equipoId', type: 'uuid', nullable: true })
  equipoId?: string;

  @Field({ nullable: true })
  @Column({ name: 'horarioId', type: 'uuid', nullable: true })
  horarioId?: string;

  @Field()
  @Column({ type: 'date' })
  fecha: Date;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 5, nullable: true })
  hora?: string;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'integer', nullable: true })
  duracion?: number;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 20, default: 'PENDIENTE', nullable: true })
  estado?: string;

  @Field(() => Date)
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  // Relación con Usuario
  @Field(() => Usuario, { nullable: true })
  @ManyToOne(() => Usuario, { eager: false })
  @JoinColumn({ name: 'usuarioId' })
  usuario?: Usuario;
}
