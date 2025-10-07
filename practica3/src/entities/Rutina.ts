import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Reserva } from "./Reserva";

@Entity()
export class Rutina {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column()
  descripcion!: string;

  @Column()
  cupoMaximo!: number;

  @OneToMany(() => Reserva, (reserva) => reserva.rutina)
  reservas!: Reserva[];
}