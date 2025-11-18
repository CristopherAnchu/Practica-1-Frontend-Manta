import { Resolver, Query, Args } from '@nestjs/graphql';
import { ReservaService } from '../services/reserva.service';
import { Reserva } from '../entities/reserva.entity';

@Resolver(() => Reserva)
export class ReservaResolver {
  constructor(private readonly reservaService: ReservaService) {}

  // Simplified Queries - Only basic read operations

  @Query(() => [Reserva], { 
    name: 'reservas',
    description: 'Obtiene todas las reservas' 
  })
  async getReservas(): Promise<Reserva[]> {
    return this.reservaService.findAll();
  }

  @Query(() => Reserva, { 
    name: 'reserva',
    description: 'Obtiene una reserva por su ID' 
  })
  async getReserva(
    @Args('id') id: string,
  ): Promise<Reserva> {
    return this.reservaService.findOne(id);
  }

  // Mutations and complex queries removed - use REST API instead
}
