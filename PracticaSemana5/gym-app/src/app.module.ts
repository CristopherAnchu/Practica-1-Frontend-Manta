import { Module } from '@nestjs/common';
import { UsersModule } from  './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { User } from './users/entities/user.entity';
import { IncidenciasModule } from './incidencias/incidencias.module';
import { EquiposModule } from './equipos/equipos.module';
import { NotificationsModule } from './notifications/notifications.module';
import { Rol } from './rol/entities/rol.entity';
import { Reserva } from './reservas/entities/reserva.entity';
import { Rutina } from './rutina/entities/rutina.entity';
import { Incidencia } from './incidencias/entities/incidencia.entity';
import { Horario } from './horarios/entities/horario.entity';
import { Equipo } from './equipos/entities/equipo.entity';
import { Capacidad } from './capacidades/entities/capacidad.entity';
import { Asistencia } from './asistencias/entities/asistencia.entity';
import { Notification } from './notifications/entities/notification.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'GYMDB',
      entities: [User, Rol, Reserva, Rutina, Notification, Incidencia, Horario, Equipo, Capacidad, Asistencia],
      synchronize: true,
    }),
    IncidenciasModule,
    EquiposModule,
    NotificationsModule,
  ],
})
export class AppModule {}
