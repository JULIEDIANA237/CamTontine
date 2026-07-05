import { Test, TestingModule } from '@nestjs/testing';
import { TontinesController } from './tontines.controller';
import { TontinesService } from './tontines.service';

describe('TontinesController', () => {
  let controller: TontinesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TontinesController],
      providers: [TontinesService],
    }).compile();

    controller = module.get<TontinesController>(TontinesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
