// users.module.ts
import { Module } from '@nestjs/common';
import { UsersRestService } from './users.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule, // <-- IMPORTANTE: así Nest puede inyectar HttpService
  ],
  providers: [UsersRestService],
  exports: [UsersRestService],  // <- Muy importante exportarlo
})
export class UsersModule {}
