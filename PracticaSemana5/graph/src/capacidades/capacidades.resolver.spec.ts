import { Test, TestingModule } from '@nestjs/testing';
import { CapacidadesResolver } from './capacidades.resolver';
import { CapacidadesService } from './capacidades.service';

describe('CapacidadesResolver', () => {
  let resolver: CapacidadesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CapacidadesResolver, CapacidadesService],
    }).compile();

    resolver = module.get<CapacidadesResolver>(CapacidadesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
