import { Test, TestingModule } from '@nestjs/testing';
import { ContributionCyclesController } from './cycles.controller';
import { ContributionCyclesService } from './cycles.service';

describe('ContributionCyclesController', () => {
  let controller: ContributionCyclesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContributionCyclesController],
      providers: [ContributionCyclesService],
    }).compile();

    controller = module.get<ContributionCyclesController>(ContributionCyclesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
