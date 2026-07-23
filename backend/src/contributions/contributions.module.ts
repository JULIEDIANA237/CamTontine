import { Module } from '@nestjs/common';
import { ContributionsService } from './contributions.service';
import { ContributionsController } from './contributions.controller';
import { ContributionMapper } from './mappers/contribution.mapper';
import { ContributionLoader } from './loaders/contribution.loader';

@Module({
  controllers: [ContributionsController],
  providers: [ContributionsService, ContributionMapper, ContributionLoader],
  exports: [ContributionsService, ContributionMapper, ContributionLoader],
})
export class ContributionsModule {}
