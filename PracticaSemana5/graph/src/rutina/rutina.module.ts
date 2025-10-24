// src/rutina/rutina.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RutinaRestService } from './rutina.service';
import { RutinaResolver } from './rutina.resolver';
import { UsersModule } from '../users/users.module'; // Para relaciones

@Module({
  imports: [HttpModule, UsersModule],
  providers: [RutinaResolver, RutinaRestService],
  exports: [RutinaRestService],
})
export class RutinaModule {}
