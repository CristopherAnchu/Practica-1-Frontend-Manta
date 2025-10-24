import { Test, TestingModule } from '@nestjs/testing';
import { EquiposResolver } from './equipos.resolver';
import { EquiposService } from './equipos.service';

describe('EquiposResolver', () => {
  let resolver: EquiposResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EquiposResolver, EquiposService],
    }).compile();

    resolver = module.get<EquiposResolver>(EquiposResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
