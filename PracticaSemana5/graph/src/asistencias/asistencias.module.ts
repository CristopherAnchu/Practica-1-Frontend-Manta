// src/asistencias/asistencias.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AsistenciasRestService } from './asistencias.service';
import { AsistenciasResolver } from './asistencias.resolver';

@Module({
  imports: [HttpModule],
  providers: [AsistenciasResolver, AsistenciasRestService],
  exports: [AsistenciasRestService, HttpModule],
})
export class AsistenciasModule {}
