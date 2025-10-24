import { Test, TestingModule } from '@nestjs/testing';
import { ReservasResolver } from './reservas.resolver';
import { ReservasService } from './reservas.service';

describe('ReservasResolver', () => {
  let resolver: ReservasResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReservasResolver, ReservasService],
    }).compile();

    resolver = module.get<ReservasResolver>(ReservasResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
