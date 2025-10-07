import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Rol } from "./Rol";
import { Reserva } from "./Reserva";

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column()
  correo!: string;

  @Column()
  tipo!: string; // estudiante, docente, administrativo

  @ManyToOne(() => Rol, (rol) => rol.usuarios)
  rol!: Rol;

  @OneToMany(() => Reserva, (reserva) => reserva.usuario)
  reservas!: Reserva[];
}