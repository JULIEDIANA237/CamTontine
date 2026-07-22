import { Module } from '@nestjs/common';
import { CyclesService } from './cycles.service';
import { CyclesController } from './cycles.controller';
import { CycleMapper } from './mappers/cycle.mapper';
import { CycleLoader } from './loaders/cycle.loader';

@Module({
  controllers: [CyclesController],
  providers: [CyclesService, CycleMapper, CycleLoader],
  exports: [CyclesService, CycleMapper, CycleLoader],
})
export class CyclesModule { }

