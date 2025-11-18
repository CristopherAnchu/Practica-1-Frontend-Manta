import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Entity('rutina_usuarios') // Mapear a la tabla 'rutina_usuarios' de Golang
export class Rutina {
  @Field(() => ID)
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Field()
  @Column({ name: 'usuarioId', type: 'uuid' })
  usuarioId: string;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  titulo: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'jsonb', nullable: true })
  ejercicios?: string; // JSONB almacenado como string

  @Field(() => Date)
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
