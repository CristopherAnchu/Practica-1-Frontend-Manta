import { Module } from '@nestjs/common';
import { UsersModule } from  './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { User } from './users/entities/user.entity';
import { Rol } from './rol/entities/rol.entity';
import { Rutina } from './rutina/entities/rutina.entity';
import { Reserva } from './reservas/entities/reserva.entity';
import { Equipo } from './equipos/entities/equipo.entity';
import { Horario } from './horarios/entities/horario.entity';
import { Capacidad } from './capacidades/entities/capacidad.entity';
import { Asistencia } from './asistencias/entities/asistencia.entity';
import { Incidencia } from './incidencias/entities/incidencia.entity';
import { Notification } from './notifications/entities/notification.entity';
import { IncidenciasModule } from './incidencias/incidencias.module';
import { EquiposModule } from './equipos/equipos.module';
import { NotificationsModule } from './notifications/notifications.module';
import { RolModule } from './rol/rol.module';
import { RutinaModule } from './rutina/rutina.module';
import { ReservasModule } from './reservas/reservas.module';
import { HorariosModule } from './horarios/horarios.module';
import { CapacidadesModule } from './capacidades/capacidades.module';
import { AsistenciasModule } from './asistencias/asistencias.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'GYMDB',
      entities: [User, Rol, Rutina, Reserva, Equipo, Horario, Capacidad, Asistencia, Incidencia, Notification],
      synchronize: true,
    }),
    UsersModule,
    RolModule,
    RutinaModule,
    ReservasModule,
    EquiposModule,
    HorariosModule,
    CapacidadesModule,
    AsistenciasModule,
    IncidenciasModule,
    NotificationsModule,
  ],
})
export class AppModule {}
