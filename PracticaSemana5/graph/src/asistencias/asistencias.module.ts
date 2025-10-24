import { Module } from '@nestjs/common';
import { AsistenciasService } from './asistencias.service';
import { AsistenciasResolver } from './asistencias.resolver';

@Module({
  providers: [AsistenciasResolver, AsistenciasService],
})
export class AsistenciasModule {}
