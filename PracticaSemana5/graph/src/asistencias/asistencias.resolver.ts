import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AsistenciasService } from './asistencias.service';
import { Asistencia } from './entities/asistencia.entity';
import { CreateAsistenciaInput } from './dto/create-asistencia.input';
import { UpdateAsistenciaInput } from './dto/update-asistencia.input';

@Resolver(() => Asistencia)
export class AsistenciasResolver {
  constructor(private readonly asistenciasService: AsistenciasService) {}

  @Mutation(() => Asistencia)
  createAsistencia(@Args('createAsistenciaInput') createAsistenciaInput: CreateAsistenciaInput) {
    return this.asistenciasService.create(createAsistenciaInput);
  }

  @Query(() => [Asistencia], { name: 'asistencias' })
  findAll() {
    return this.asistenciasService.findAll();
  }

  @Query(() => Asistencia, { name: 'asistencia' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.asistenciasService.findOne(id);
  }

  @Mutation(() => Asistencia)
  updateAsistencia(@Args('updateAsistenciaInput') updateAsistenciaInput: UpdateAsistenciaInput) {
    return this.asistenciasService.update(updateAsistenciaInput.id, updateAsistenciaInput);
  }

  @Mutation(() => Asistencia)
  removeAsistencia(@Args('id', { type: () => Int }) id: number) {
    return this.asistenciasService.remove(id);
  }
}
