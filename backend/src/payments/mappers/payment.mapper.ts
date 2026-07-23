import { Injectable } from '@nestjs/common';
import { BaseMapper } from '../../common/mappers';
import { PaymentResponseDto } from '../dto/responses/payment-response.dto';
import { PaymentListItemDto } from '../dto/responses/payment-list-item.dto';
import { PaymentWithRelations } from '../payment.prisma';

@Injectable()
export class PaymentMapper extends BaseMapper<
    PaymentWithRelations,
    PaymentResponseDto,
    PaymentListItemDto
> {
    override toResponse(payment: PaymentWithRelations): PaymentResponseDto {
        return {
            id: payment.id,
            contributionId: payment.contributionId,
            method: payment.method,
            amount: Number(payment.amount),
            status: payment.status,
            transactionReference: payment.transactionReference,
            externalReference: payment.externalReference,
            receiptNumber: payment.receiptNumber,
            paidAt: payment.paidAt,
            createdAt: payment.createdAt,
            contribution: {
                id: payment.contribution.id,
                amount: Number(payment.contribution.amount),
                cycleId: payment.contribution.cycleId,
                user: {
                    id: payment.contribution.membership.user.id,
                    firstName: payment.contribution.membership.user.firstName,
                    lastName: payment.contribution.membership.user.lastName,
                    email: payment.contribution.membership.user.email,
                },
            },
        };
    }

    override toListItem(payment: PaymentWithRelations): PaymentListItemDto {
        return {
            id: payment.id,
            contributionId: payment.contributionId,
            method: payment.method,
            amount: Number(payment.amount),
            status: payment.status,
            receiptNumber: payment.receiptNumber,
            paidAt: payment.paidAt,
            createdAt: payment.createdAt,
        };
    }
}
