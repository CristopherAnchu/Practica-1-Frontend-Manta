import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Reserva } from './reserva.entity';

@ObjectType()
@Entity()
export class Rutina {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  nombre: string;

  @Field()
  @Column('text')
  descripcion: string;

  @Field(() => Int)
  @Column()
  cupoMaximo: number;

  @Field(() => Int)
  @Column({ default: 0 })
  duracionMinutos: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  instructor?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  nivel?: string; // principiante, intermedio, avanzado

  @Field(() => Float, { nullable: true })
  @Column('decimal', { precision: 3, scale: 2, nullable: true })
  calificacionPromedio?: number;

  @Field(() => Boolean)
  @Column({ default: true })
  activa: boolean;

  @Field(() => [Reserva], { nullable: 'itemsAndList' })
  @OneToMany(() => Reserva, (reserva) => reserva.rutina)
  reservas: Reserva[];
}
