import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth.module';
import { User, RefreshToken } from './entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [User, RefreshToken],
      synchronize: true, // Solo para desarrollo, usar migraciones en producción
      ssl: {
        rejectUnauthorized: false,
      },
      logging: ['error', 'warn'],
    }),
    AuthModule,
  ],
})
export class AppModule {}
