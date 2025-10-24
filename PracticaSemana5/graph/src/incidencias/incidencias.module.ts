import { Module } from '@nestjs/common';
import { IncidenciasService } from './incidencias.service';
import { IncidenciasResolver } from './incidencias.resolver';

@Module({
  providers: [IncidenciasResolver, IncidenciasService],
})
export class IncidenciasModule {}
