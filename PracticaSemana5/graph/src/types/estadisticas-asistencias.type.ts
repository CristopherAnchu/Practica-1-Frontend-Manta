import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class EstadisticasAsistenciasType {
  @Field(() => Int)
  mes: number;

  @Field(() => Int)
  anio: number;

  @Field(() => Int)
  totalAsistencias: number;

  @Field(() => [Int])
  asistenciasPorUsuario: Record<number, number>;
}
