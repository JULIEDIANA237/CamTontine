import { Module } from '@nestjs/common';
import { TontinesService } from './tontines.service';
import { TontinesController } from './tontines.controller';

@Module({
  controllers: [TontinesController],
  providers: [TontinesService],
})
export class TontinesModule {}
