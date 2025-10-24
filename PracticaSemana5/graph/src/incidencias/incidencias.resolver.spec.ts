import { Test, TestingModule } from '@nestjs/testing';
import { IncidenciasResolver } from './incidencias.resolver';
import { IncidenciasService } from './incidencias.service';

describe('IncidenciasResolver', () => {
  let resolver: IncidenciasResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IncidenciasResolver, IncidenciasService],
    }).compile();

    resolver = module.get<IncidenciasResolver>(IncidenciasResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
