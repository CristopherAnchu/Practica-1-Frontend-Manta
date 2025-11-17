import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva } from '../entities/reserva.entity';
import { ReservaService } from '../services/reserva.service';
import { ReservaResolver } from '../resolvers/reserva.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Reserva])],
  providers: [ReservaService, ReservaResolver],
  exports: [ReservaService],
})
export class ReservaModule {}
