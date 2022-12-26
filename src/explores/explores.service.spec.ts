import { Test, TestingModule } from '@nestjs/testing';
import { ExploresService } from './explores.service';

describe('ExploresService', () => {
  let service: ExploresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExploresService],
    }).compile();

    service = module.get<ExploresService>(ExploresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
