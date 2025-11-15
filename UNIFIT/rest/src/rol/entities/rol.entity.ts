import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Rol {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  nombre: string;

  @OneToMany(() => User, (user) => user.rol)
  users: User[];
}
