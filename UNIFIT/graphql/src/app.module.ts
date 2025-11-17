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

    // Configuración de TypeORM
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'unifit.db',
      synchronize: true, // En producción usar migraciones
      logging: ['error', 'warn', 'info'],
      entities: [Usuario, Rol, Rutina, Reserva],
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
