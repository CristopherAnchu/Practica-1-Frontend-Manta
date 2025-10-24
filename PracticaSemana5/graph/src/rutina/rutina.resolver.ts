// src/rutina/rutina.resolver.ts
import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { RutinaType } from '../types/rutina.types';
import { RutinaRestService } from './rutina.service';

@Resolver(() => RutinaType)
export class RutinaResolver {
  constructor(private rutinaService: RutinaRestService) {}

  @Query(() => [RutinaType], { name: 'rutinas' })
  async getRutinas() {
    return this.rutinaService.findAll();
  }

  @Query(() => RutinaType, { name: 'rutina' })
  async getRutina(@Args('id', { type: () => Int }) id: number) {
    return this.rutinaService.findOne(id);
  }
}
