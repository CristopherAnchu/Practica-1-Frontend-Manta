import { Module } from '@nestjs/common';
import { RolService } from './rol.service';
import { RolResolver } from './rol.resolver';

@Module({
  providers: [RolResolver, RolService],
})
export class RolModule {}
