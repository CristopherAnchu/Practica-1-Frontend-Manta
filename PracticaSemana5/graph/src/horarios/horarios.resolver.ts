import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { HorariosService } from './horarios.service';
import { Horario } from './entities/horario.entity';
import { CreateHorarioInput } from './dto/create-horario.input';
import { UpdateHorarioInput } from './dto/update-horario.input';

@Resolver(() => Horario)
export class HorariosResolver {
  constructor(private readonly horariosService: HorariosService) {}

  @Mutation(() => Horario)
  createHorario(@Args('createHorarioInput') createHorarioInput: CreateHorarioInput) {
    return this.horariosService.create(createHorarioInput);
  }

  @Query(() => [Horario], { name: 'horarios' })
  findAll() {
    return this.horariosService.findAll();
  }

  @Query(() => Horario, { name: 'horario' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.horariosService.findOne(id);
  }

  @Mutation(() => Horario)
  updateHorario(@Args('updateHorarioInput') updateHorarioInput: UpdateHorarioInput) {
    return this.horariosService.update(updateHorarioInput.id, updateHorarioInput);
  }

  @Mutation(() => Horario)
  removeHorario(@Args('id', { type: () => Int }) id: number) {
    return this.horariosService.remove(id);
  }
}
