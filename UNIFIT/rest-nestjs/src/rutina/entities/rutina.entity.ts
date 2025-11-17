import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Rutina {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

  @Column({ type: 'int', nullable: true })
  duracionMinutos: number;

  @ManyToOne(() => User, (user) => user.id, { eager: true })
  usuario: User;
}
