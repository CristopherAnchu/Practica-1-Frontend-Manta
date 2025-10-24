// analytics.module.ts
import { Module } from '@nestjs/common';
import { AnalyticsAsistenciasResolver } from './analytics-asistencias.resolver';
import { AsistenciasRestService } from '../asistencias/asistencias.service';
import { UsersModule } from '../users/users.module'; // <- importar módulo que contiene UsersRestService
import { ReservasModule } from 'src/reservas/reservas.module';
import { AsistenciasModule } from 'src/asistencias/asistencias.module';

@Module({
  imports: [UsersModule,ReservasModule
    ,AsistenciasModule
  ],  
  providers: [AnalyticsAsistenciasResolver, AsistenciasRestService],
})
export class AnalyticsModule {}
