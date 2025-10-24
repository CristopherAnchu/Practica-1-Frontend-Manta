import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports : [HttpModule],
  providers: [UsersResolver, UsersService],
})
export class UsersModule {}