import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Rol } from './rol.entity';
import { Reserva } from './reserva.entity';

@ObjectType()
@Entity()
export class Usuario {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  nombre: string;

  @Field()
  @Column({ unique: true })
  correo: string;

  @Field()
  @Column()
  tipo: string; // estudiante, docente, administrativo

  @Field({ nullable: true })
  @Column({ nullable: true })
  telefono?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  cedula?: string;

  @Field(() => Date)
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  fechaRegistro: Date;

  @Field(() => Boolean)
  @Column({ default: true })
  activo: boolean;

  @Field(() => Rol, { nullable: true })
  @ManyToOne(() => Rol, (rol) => rol.usuarios, { eager: true })
  rol: Rol;

  @Field(() => [Reserva], { nullable: 'itemsAndList' })
  @OneToMany(() => Reserva, (reserva) => reserva.usuario)
  reservas: Reserva[];
}
