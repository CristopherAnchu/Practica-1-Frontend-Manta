import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Usuario } from './usuario.entity';
import { Rutina } from './rutina.entity';

@ObjectType()
@Entity()
export class Reserva {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Date)
  @Column({ type: 'datetime' })
  fecha: Date;

  @Field(() => Date)
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  fechaCreacion: Date;

  @Field()
  @Column()
  estado: string; // activa, cancelada, finalizada, confirmada

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  observaciones?: string;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  calificacion?: number; // 1-5

  @Field(() => Boolean)
  @Column({ default: false })
  asistio: boolean;

  @Field(() => Usuario)
  @ManyToOne(() => Usuario, (usuario) => usuario.reservas, { 
    onDelete: 'CASCADE',
    eager: true 
  })
  usuario: Usuario;

  @Field(() => Rutina)
  @ManyToOne(() => Rutina, (rutina) => rutina.reservas, { 
    eager: true 
  })
  rutina: Rutina;
}
