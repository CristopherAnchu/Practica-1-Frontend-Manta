import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Incidencia {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column()
    descripcion: string;
    @Column()
    estado: string; // revisada, pendiente
}
