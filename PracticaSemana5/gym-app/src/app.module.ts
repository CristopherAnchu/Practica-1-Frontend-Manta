import { Module } from '@nestjs/common';
import { UsersModule } from  './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { User } from './users/entities/user.entity';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'GYMDB',
      entities: [User],
      synchronize: true,
    }),
  ],
})
export class AppModule {}
