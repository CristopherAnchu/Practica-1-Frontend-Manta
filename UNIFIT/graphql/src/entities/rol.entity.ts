import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Usuario } from './usuario.entity';

@ObjectType()
@Entity()
export class Rol {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  nombre: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  descripcion?: string;

  @Field(() => [String], { nullable: 'itemsAndList' })
  @Column('simple-array', { nullable: true })
  permisos: string[];

  @Field(() => [Usuario], { nullable: 'itemsAndList' })
  @OneToMany(() => Usuario, (usuario) => usuario.rol)
  usuarios: Usuario[];
}
