import { Module } from '@nestjs/common';

import { TontinesController } from './tontines.controller';
import { TontinesService } from './tontines.service';

import { PrismaModule } from '../prisma/prisma.module';
import { TontineMapper } from './mappers/tontine.mapper';

@Module({
  imports: [PrismaModule],
  controllers: [TontinesController],
  providers: [TontinesService, TontineMapper],
  exports: [TontinesService],
})
export class TontinesModule { }