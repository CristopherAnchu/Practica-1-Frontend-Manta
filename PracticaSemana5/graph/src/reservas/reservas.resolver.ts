import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ReservasService } from './reservas.service';
import { Reserva } from './entities/reserva.entity';
import { CreateReservaInput } from './dto/create-reserva.input';
import { UpdateReservaInput } from './dto/update-reserva.input';

@Resolver(() => Reserva)
export class ReservasResolver {
  constructor(private readonly reservasService: ReservasService) {}

  @Mutation(() => Reserva)
  createReserva(@Args('createReservaInput') createReservaInput: CreateReservaInput) {
    return this.reservasService.create(createReservaInput);
  }

  @Query(() => [Reserva], { name: 'reservas' })
  findAll() {
    return this.reservasService.findAll();
  }

  @Query(() => Reserva, { name: 'reserva' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.reservasService.findOne(id);
  }

  @Mutation(() => Reserva)
  updateReserva(@Args('updateReservaInput') updateReservaInput: UpdateReservaInput) {
    return this.reservasService.update(updateReservaInput.id, updateReservaInput);
  }

  @Mutation(() => Reserva)
  removeReserva(@Args('id', { type: () => Int }) id: number) {
    return this.reservasService.remove(id);
  }
}
