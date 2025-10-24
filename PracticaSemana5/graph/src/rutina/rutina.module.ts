import { Module } from '@nestjs/common';
import { RutinaService } from './rutina.service';
import { RutinaResolver } from './rutina.resolver';

@Module({
  providers: [RutinaResolver, RutinaService],
})
export class RutinaModule {}
