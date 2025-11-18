import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { UsuarioModule } from './modules/usuario.module';
import { RolModule } from './modules/rol.module';
import { RutinaModule } from './modules/rutina.module';
import { ReservaModule } from './modules/reserva.module';
import { Usuario } from './entities/usuario.entity';
import { Rol } from './entities/rol.entity';
import { Rutina } from './entities/rutina.entity';
import { Reserva } from './entities/reserva.entity';

@Module({
  imports: [
    // Configuración de GraphQL
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true, // Habilitar Apollo Playground
      introspection: true,
      formatError: (error) => {
        return {
          message: error.message,
          code: error.extensions?.code,
          locations: error.locations,
          path: error.path,
        };
      },
    }),

    // Configuración de TypeORM - PostgreSQL (misma BD que Golang)
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || 'postgres://neondb_owner:npg_ePlbRr4NvMh8@ep-blue-lab-adyjs4fj-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require',
      synchronize: false, // No sincronizar automáticamente, usar esquema de Golang
      logging: ['error', 'warn'],
      entities: [Usuario, Rol, Rutina, Reserva],
      ssl: {
        rejectUnauthorized: false
      }
    }),

    // Módulos de negocio
    UsuarioModule,
    RolModule,
    RutinaModule,
    ReservaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
