import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rol } from '../entities/rol.entity';
import { RolService } from '../services/rol.service';
import { RolResolver } from '../resolvers/rol.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Rol])],
  providers: [RolService, RolResolver],
  exports: [RolService],
})
export class RolModule {}
