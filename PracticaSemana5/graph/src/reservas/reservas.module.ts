// src/reservas/reservas.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ReservasRestService } from './reservas.service';
import { ReservasResolver } from './reservas.resolver';

@Module({
  imports: [HttpModule],
  providers: [ReservasResolver, ReservasRestService],
  exports: [ReservasRestService],
})
export class ReservasModule {}
