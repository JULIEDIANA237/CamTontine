import { Module } from '@nestjs/common';
import { PenaltiesService } from './penalties.service';
import { PenaltiesController } from './penalties.controller';
import { PenaltyMapper } from './mappers/penalty.mapper';
import { PenaltyLoader } from './loaders/penalty.loader';

@Module({
  controllers: [PenaltiesController],
  providers: [PenaltiesService, PenaltyMapper, PenaltyLoader],
  exports: [PenaltiesService, PenaltyMapper, PenaltyLoader],
})
export class PenaltiesModule {}
