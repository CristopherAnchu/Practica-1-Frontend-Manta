import { Module } from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { ReservasResolver } from './reservas.resolver';

@Module({
  providers: [ReservasResolver, ReservasService],
})
export class ReservasModule {}
