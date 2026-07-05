import { Test, TestingModule } from '@nestjs/testing';
import { ContributionCyclesService } from './contribution-cycles.service';

describe('ContributionCyclesService', () => {
  let service: ContributionCyclesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContributionCyclesService],
    }).compile();

    service = module.get<ContributionCyclesService>(ContributionCyclesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
