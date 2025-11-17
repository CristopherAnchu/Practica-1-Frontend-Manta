import { Module } from '@nestjs/common';
import { HorariosService } from './horarios.service';
import { HorariosController } from './horarios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Horario } from './entities/horario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Horario])],
  controllers: [HorariosController],
  providers: [HorariosService],
  exports: [TypeOrmModule],
})
export class HorariosModule {}
