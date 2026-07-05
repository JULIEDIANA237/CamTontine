import { Module } from '@nestjs/common';
import { ContributionCyclesService } from './contribution-cycles.service';
import { ContributionCyclesController } from './contribution-cycles.controller';

@Module({
  controllers: [ContributionCyclesController],
  providers: [ContributionCyclesService],
})
export class ContributionCyclesModule {}
