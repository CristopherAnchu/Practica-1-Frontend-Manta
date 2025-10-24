// src/incidencias/incidencias.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { IncidenciasRestService } from './incidencias.service';
import { IncidenciasResolver } from './incidencias.resolver';

@Module({
  imports: [HttpModule],
  providers: [IncidenciasResolver, IncidenciasRestService],
  exports: [IncidenciasRestService],
})
export class IncidenciasModule {}
