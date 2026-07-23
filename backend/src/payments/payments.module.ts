import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PaymentMapper } from './mappers/payment.mapper';
import { PaymentLoader } from './loaders/payment.loader';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentMapper, PaymentLoader],
  exports: [PaymentsService, PaymentMapper, PaymentLoader],
})
export class PaymentsModule {}
