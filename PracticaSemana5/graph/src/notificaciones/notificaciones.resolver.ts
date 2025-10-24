import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { NotificacionesService } from './notificaciones.service';
import { Notificacione } from './entities/notificacione.entity';
import { CreateNotificacioneInput } from './dto/create-notificacione.input';
import { UpdateNotificacioneInput } from './dto/update-notificacione.input';

@Resolver(() => Notificacione)
export class NotificacionesResolver {
  constructor(private readonly notificacionesService: NotificacionesService) {}

  @Mutation(() => Notificacione)
  createNotificacione(@Args('createNotificacioneInput') createNotificacioneInput: CreateNotificacioneInput) {
    return this.notificacionesService.create(createNotificacioneInput);
  }

  @Query(() => [Notificacione], { name: 'notificaciones' })
  findAll() {
    return this.notificacionesService.findAll();
  }

  @Query(() => Notificacione, { name: 'notificacione' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.notificacionesService.findOne(id);
  }

  @Mutation(() => Notificacione)
  updateNotificacione(@Args('updateNotificacioneInput') updateNotificacioneInput: UpdateNotificacioneInput) {
    return this.notificacionesService.update(updateNotificacioneInput.id, updateNotificacioneInput);
  }

  @Mutation(() => Notificacione)
  removeNotificacione(@Args('id', { type: () => Int }) id: number) {
    return this.notificacionesService.remove(id);
  }
}
