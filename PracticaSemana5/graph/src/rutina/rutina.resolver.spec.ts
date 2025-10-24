import { Test, TestingModule } from '@nestjs/testing';
import { RutinaResolver } from './rutina.resolver';
import { RutinaService } from './rutina.service';

describe('RutinaResolver', () => {
  let resolver: RutinaResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RutinaResolver, RutinaService],
    }).compile();

    resolver = module.get<RutinaResolver>(RutinaResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
