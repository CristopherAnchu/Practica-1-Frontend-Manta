import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Horario {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column()
    hora_inicio: string;
    @Column()
    hora_fin: string;
    @Column()
    dia_semana: string;
    @Column()
    estado: string;
}
