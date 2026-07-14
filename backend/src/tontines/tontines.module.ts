import { Module } from '@nestjs/common';

import { TontinesController } from './tontines.controller';
import { TontinesService } from './tontines.service';

import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TontinesController],
  providers: [TontinesService],
  exports: [TontinesService],
})
export class TontinesModule { }