import { Module } from '@nestjs/common';
import { CapacidadesService } from './capacidades.service';
import { CapacidadesController } from './capacidades.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Capacidad } from './entities/capacidad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Capacidad])],
  controllers: [CapacidadesController],
  providers: [CapacidadesService],
  exports: [TypeOrmModule],
})

export class CapacidadesModule {}
