import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Capacidad {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column()
    id_horario: string;
    @Column()
    fecha: string;
    @Column()
    capacidad_maxima: string;
    @Column()
    capacidad_minima: string;
}
