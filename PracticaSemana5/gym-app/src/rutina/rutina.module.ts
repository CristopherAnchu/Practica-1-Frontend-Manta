import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rutina } from './entities/rutina.entity';
import { RutinaService } from './rutina.service';
import { RutinaController } from './rutina.controller';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rutina, User])],
  controllers: [RutinaController],
  providers: [RutinaService],
  exports: [RutinaService],
})
export class RutinaModule {}
