import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RutinaService } from './rutina.service';
import { Rutina } from './entities/rutina.entity';
import { CreateRutinaInput } from './dto/create-rutina.input';
import { UpdateRutinaInput } from './dto/update-rutina.input';

@Resolver(() => Rutina)
export class RutinaResolver {
  constructor(private readonly rutinaService: RutinaService) {}

  @Mutation(() => Rutina)
  createRutina(@Args('createRutinaInput') createRutinaInput: CreateRutinaInput) {
    return this.rutinaService.create(createRutinaInput);
  }

  @Query(() => [Rutina], { name: 'rutina' })
  findAll() {
    return this.rutinaService.findAll();
  }

  @Query(() => Rutina, { name: 'rutina' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.rutinaService.findOne(id);
  }

  @Mutation(() => Rutina)
  updateRutina(@Args('updateRutinaInput') updateRutinaInput: UpdateRutinaInput) {
    return this.rutinaService.update(updateRutinaInput.id, updateRutinaInput);
  }

  @Mutation(() => Rutina)
  removeRutina(@Args('id', { type: () => Int }) id: number) {
    return this.rutinaService.remove(id);
  }
}
