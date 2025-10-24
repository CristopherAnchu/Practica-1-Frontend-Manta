import { Test, TestingModule } from '@nestjs/testing';
import { AsistenciasResolver } from './asistencias.resolver';
import { AsistenciasService } from './asistencias.service';

describe('AsistenciasResolver', () => {
  let resolver: AsistenciasResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AsistenciasResolver, AsistenciasService],
    }).compile();

    resolver = module.get<AsistenciasResolver>(AsistenciasResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
