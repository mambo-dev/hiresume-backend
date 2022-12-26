import { Test, TestingModule } from '@nestjs/testing';
import { ExploresController } from './explores.controller';
import { ExploresService } from './explores.service';

describe('ExploresController', () => {
  let controller: ExploresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExploresController],
      providers: [ExploresService],
    }).compile();

    controller = module.get<ExploresController>(ExploresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
