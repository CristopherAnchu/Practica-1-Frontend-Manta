import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Reserva } from './reserva.entity';

@ObjectType()
@Entity('users') // Mapear a la tabla 'users' de Golang
export class Usuario {
  @Field(() => ID)
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Field()
  @Column({ type: 'varchar', length: 255, nullable: true })
  nombre: string;

  @Field()
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  // No exponemos password en GraphQL
  @Column({ type: 'varchar', length: 255, nullable: true })
  password: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', nullable: true })
  tipo?: string; // ADMINISTRADOR, USUARIO_FINAL

  @Field({ nullable: true })
  @Column({ type: 'varchar', nullable: true })
  rol?: string; // ADMINISTRADOR, USUARIO

  @Field(() => Date)
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  // Relaciones - comentadas por ahora ya que las tablas de Golang pueden tener estructura diferente
  // @Field(() => [Reserva], { nullable: 'itemsAndList' })
  // @OneToMany(() => Reserva, (reserva) => reserva.usuario)
  // reservas: Reserva[];
}
