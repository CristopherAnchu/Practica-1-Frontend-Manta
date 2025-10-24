// src/equipos/equipos.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EquiposRestService } from './equipos.service';
import { EquiposResolver } from './equipos.resolver';
import { CapacidadesModule } from '../capacidades/capacidades.module'; // Para relaciones

@Module({
  imports: [HttpModule, CapacidadesModule],
  providers: [EquiposResolver, EquiposRestService],
  exports: [EquiposRestService],
})
export class EquiposModule {}
