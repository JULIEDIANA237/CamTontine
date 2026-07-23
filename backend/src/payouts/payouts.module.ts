import { Module } from '@nestjs/common';
import { PayoutsService } from './payouts.service';
import { PayoutsController } from './payouts.controller';
import { PayoutMapper } from './mappers/payout.mapper';
import { PayoutLoader } from './loaders/payout.loader';

@Module({
  controllers: [PayoutsController],
  providers: [PayoutsService, PayoutMapper, PayoutLoader],
  exports: [PayoutsService, PayoutMapper, PayoutLoader],
})
export class PayoutsModule {}
