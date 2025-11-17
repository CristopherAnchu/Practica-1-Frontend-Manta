import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Notification {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column()
    message: string;
    @Column()
    userId: string; 
}
