import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Asistencia {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column()
    id_reserva: string;
    @Column()
    hora_entrada: string;
    @Column()
    hora_salida: string;
    @Column()
    estado: string;
}
