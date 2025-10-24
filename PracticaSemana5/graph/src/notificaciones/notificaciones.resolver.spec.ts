import { Test, TestingModule } from '@nestjs/testing';
import { NotificacionesResolver } from './notificaciones.resolver';
import { NotificacionesService } from './notificaciones.service';

describe('NotificacionesResolver', () => {
  let resolver: NotificacionesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificacionesResolver, NotificacionesService],
    }).compile();

    resolver = module.get<NotificacionesResolver>(NotificacionesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
