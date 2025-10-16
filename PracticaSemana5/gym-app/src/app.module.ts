import { Module } from '@nestjs/common';
import { UsersModule } from  './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { User } from './users/entities/user.entity';
import { IncidenciasModule } from './incidencias/incidencias.module';
import { EquiposModule } from './equipos/equipos.module';
import { NotificationsModule } from './notifications/notifications.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'GYMDB',
      entities: [User],
      synchronize: true,
    }),
    IncidenciasModule,
    EquiposModule,
    NotificationsModule,
  ],
})
export class AppModule {}
