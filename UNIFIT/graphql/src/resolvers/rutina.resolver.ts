import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RutinaService } from '../services/rutina.service';
import { Rutina } from '../entities/rutina.entity';
import { CreateRutinaInput, UpdateRutinaInput, RutinaFilterInput } from '../dto/rutina.input';
import { RutinaPopular } from '../dto/reportes.types';

@Resolver(() => Rutina)
export class RutinaResolver {
  constructor(private readonly rutinaService: RutinaService) {}

  // Queries

  @Query(() => [Rutina], { 
    name: 'rutinas',
    description: 'Obtiene todas las rutinas con filtros opcionales' 
  })
  async getRutinas(
    @Args('filter', { type: () => RutinaFilterInput, nullable: true }) 
    filter?: RutinaFilterInput,
  ): Promise<Rutina[]> {
    return this.rutinaService.findAll(filter);
  }

  @Query(() => Rutina, { 
    name: 'rutina',
    description: 'Obtiene una rutina por su ID' 
  })
  async getRutina(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Rutina> {
    return this.rutinaService.findOne(id);
  }

  @Query(() => [RutinaPopular], {
    name: 'rutinasPopulares',
    description: 'Obtiene las rutinas más populares ordenadas por número de reservas'
  })
  async getRutinasPopulares(
    @Args('limite', { type: () => Int, nullable: true }) limite?: number,
  ): Promise<RutinaPopular[]> {
    return this.rutinaService.getRutinasPopulares(limite);
  }

  // Mutations

  @Mutation(() => Rutina, {
    name: 'crearRutina',
    description: 'Crea una nueva rutina'
  })
  async crearRutina(
    @Args('input') createRutinaInput: CreateRutinaInput,
  ): Promise<Rutina> {
    return this.rutinaService.create(createRutinaInput);
  }

  @Mutation(() => Rutina, {
    name: 'actualizarRutina',
    description: 'Actualiza una rutina existente'
  })
  async actualizarRutina(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') updateRutinaInput: UpdateRutinaInput,
  ): Promise<Rutina> {
    return this.rutinaService.update(id, updateRutinaInput);
  }

  @Mutation(() => Rutina, {
    name: 'actualizarCalificacionRutina',
    description: 'Recalcula la calificación promedio de una rutina'
  })
  async actualizarCalificacionRutina(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Rutina> {
    return this.rutinaService.actualizarCalificacionPromedio(id);
  }

  @Mutation(() => Boolean, {
    name: 'eliminarRutina',
    description: 'Elimina una rutina por su ID'
  })
  async eliminarRutina(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    return this.rutinaService.remove(id);
  }
}
