import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class EstadisticasReservasType {
  @Field(() => Int)
  mes: number;

  @Field(() => Int)
  anio: number;

  @Field(() => Int)
  totalReservas: number;

  @Field(() => Float)
  duracionPromedio: number;

  @Field(() => Float)
  reservaMax: number;

  @Field(() => Float)
  reservaMin: number;
}
