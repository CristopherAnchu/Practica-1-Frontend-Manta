import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity'; 

@Entity()
export class Reserva {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fecha: Date;

  @Column()
  horaInicio: string;

  @Column()
  horaFin: string;

  @Column()
  tipoActividad: string; 

  @Column({ default: 'pendiente' })
  estado: string; 

  @ManyToOne(() => User, (user) => user.id, { eager: true })
  usuario: User;
}
