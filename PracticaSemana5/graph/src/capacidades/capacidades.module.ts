// src/capacidades/capacidades.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CapacidadesRestService } from './capacidades.service';
import { CapacidadesResolver } from './capacidades.resolver';

@Module({
  imports: [HttpModule],
  providers: [CapacidadesResolver, CapacidadesRestService],
  exports: [CapacidadesRestService],
})
export class CapacidadesModule {}
