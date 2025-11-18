import { Resolver, Query, Args } from '@nestjs/graphql';
import { RutinaService } from '../services/rutina.service';
import { Rutina } from '../entities/rutina.entity';

@Resolver(() => Rutina)
export class RutinaResolver {
  constructor(private readonly rutinaService: RutinaService) {}

  // Simplified Queries - Only basic read operations

  @Query(() => [Rutina], { 
    name: 'rutinas',
    description: 'Obtiene todas las rutinas' 
  })
  async getRutinas(): Promise<Rutina[]> {
    return this.rutinaService.findAll();
  }

  @Query(() => Rutina, { 
    name: 'rutina',
    description: 'Obtiene una rutina por su ID' 
  })
  async getRutina(
    @Args('id') id: string,
  ): Promise<Rutina> {
    return this.rutinaService.findOne(id);
  }

  // Mutations and complex queries removed - use REST API instead
}
