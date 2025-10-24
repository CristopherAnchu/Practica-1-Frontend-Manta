import { Test, TestingModule } from '@nestjs/testing';
import { CapacidadesService } from './capacidades.service';

describe('CapacidadesService', () => {
  let service: CapacidadesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CapacidadesService],
    }).compile();

    service = module.get<CapacidadesService>(CapacidadesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
