import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Equipo {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column()
    nombre: string;
    @Column()
    descripcion: string;
    @Column()
    tipo: string;
}
