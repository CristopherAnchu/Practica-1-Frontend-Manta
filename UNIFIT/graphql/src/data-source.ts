import { DataSource } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { Rol } from './entities/rol.entity';
import { Rutina } from './entities/rutina.entity';
import { Reserva } from './entities/reserva.entity';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'unifit.db',
  synchronize: true, // En producción usar migraciones
  logging: true,
  entities: [Usuario, Rol, Rutina, Reserva],
  subscribers: [],
  migrations: [],
});
