import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Usuario } from "./Usuario";
import { Rutina} from "./Rutina";

@Entity()
export class Reserva {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fecha!: Date;

  @Column()
  estado!: string; // activa, cancelada, finalizada

  @ManyToOne(() => Usuario, (usuario) => usuario.reservas, { onDelete: "CASCADE" })
  usuario!: Usuario;

  @ManyToOne(() => Rutina, (rutina) => rutina.reservas)
  rutina!: Rutina;
}