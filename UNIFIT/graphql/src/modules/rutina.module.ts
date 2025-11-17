import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rutina } from '../entities/rutina.entity';
import { RutinaService } from '../services/rutina.service';
import { RutinaResolver } from '../resolvers/rutina.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Rutina])],
  providers: [RutinaService, RutinaResolver],
  exports: [RutinaService],
})
export class RutinaModule {}
