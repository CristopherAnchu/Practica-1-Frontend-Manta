// src/rol/rol.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RolRestService } from './rol.service';
import { RolResolver } from './rol.resolver';

@Module({
  imports: [HttpModule],
  providers: [RolResolver, RolRestService],
  exports: [RolRestService],
})
export class RolModule {}
