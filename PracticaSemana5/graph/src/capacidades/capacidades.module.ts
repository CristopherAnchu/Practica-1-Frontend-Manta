import { Module } from '@nestjs/common';
import { CapacidadesService } from './capacidades.service';
import { CapacidadesResolver } from './capacidades.resolver';

@Module({
  providers: [CapacidadesResolver, CapacidadesService],
})
export class CapacidadesModule {} //hola me llamo ronny 
