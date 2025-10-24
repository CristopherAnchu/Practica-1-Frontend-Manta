import { Module } from '@nestjs/common';
import { EquiposService } from './equipos.service';
import { EquiposResolver } from './equipos.resolver';

@Module({
  providers: [EquiposResolver, EquiposService],
})
export class EquiposModule {}
