import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

// Tipos para reportes complejos

@ObjectType()
export class EstadisticasReservas {
  @Field(() => Int)
  totalReservas: number;

  @Field(() => Int)
  reservasActivas: number;

  @Field(() => Int)
  reservasCanceladas: number;

  @Field(() => Int)
  reservasFinalizadas: number;

  @Field(() => Float)
  porcentajeAsistencia: number;

  @Field(() => Float)
  calificacionPromedio: number;
}

@ObjectType()
export class RutinaPopular {
  @Field(() => Int)
  rutinaId: number;

  @Field()
  nombreRutina: string;

  @Field(() => Int)
  totalReservas: number;

  @Field(() => Int)
  cupoMaximo: number;

  @Field(() => Float)
  ocupacionPromedio: number;

  @Field(() => Float, { nullable: true })
  calificacionPromedio?: number;
}

@ObjectType()
export class UsuarioActivo {
  @Field(() => Int)
  usuarioId: number;

  @Field()
  nombreUsuario: string;

  @Field()
  correo: string;

  @Field()
  tipo: string;

  @Field(() => Int)
  totalReservas: number;

  @Field(() => Int)
  reservasCompletadas: number;

  @Field(() => Float)
  porcentajeAsistencia: number;
}

@ObjectType()
export class ReporteOcupacion {
  @Field(() => Int)
  rutinaId: number;

  @Field()
  nombreRutina: string;

  @Field()
  fecha: String;

  @Field(() => Int)
  reservasActivas: number;

  @Field(() => Int)
  cupoMaximo: number;

  @Field(() => Float)
  porcentajeOcupacion: number;

  @Field(() => Int)
  cuposDisponibles: number;
}

@ObjectType()
export class TendenciaReservas {
  @Field()
  fecha: string;

  @Field(() => Int)
  totalReservas: number;

  @Field(() => Int)
  reservasCreadas: number;

  @Field(() => Int)
  reservasCanceladas: number;

  @Field(() => Int)
  reservasCompletadas: number;
}

@ObjectType()
export class ResumenUsuario {
  @Field(() => Int)
  usuarioId: number;

  @Field()
  nombre: string;

  @Field()
  correo: string;

  @Field(() => Int)
  totalReservas: number;

  @Field(() => Int)
  reservasProximas: number;

  @Field(() => Int)
  reservasCompletadas: number;

  @Field(() => Float)
  calificacionPromedio: number;

  @Field()
  ultimaReserva: string;
}
