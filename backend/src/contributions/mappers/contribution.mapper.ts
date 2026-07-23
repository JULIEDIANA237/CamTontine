import { Injectable } from '@nestjs/common';
import { BaseMapper } from '../../common/mappers';
import { ContributionResponseDto } from '../dto/responses/contribution-response.dto';
import { ContributionListItemDto } from '../dto/responses/contribution-list-item.dto';
import { ContributionWithRelations } from '../contribution.prisma';

@Injectable()
export class ContributionMapper
    extends BaseMapper<
        ContributionWithRelations,
        ContributionResponseDto,
        ContributionListItemDto
    > {

    override toResponse(
        contribution: ContributionWithRelations,
    ): ContributionResponseDto {

        return {
            id: contribution.id,

            membershipId: contribution.membershipId,

            cycleId: contribution.cycleId,

            amount: Number(contribution.amount),

            status: contribution.status,

            paidAt: contribution.paidAt,

            validatedAt: contribution.validatedAt,

            validatedById: contribution.validatedById,

            createdAt: contribution.createdAt,

            updatedAt: contribution.updatedAt,

            membership: {
                id: contribution.membership.id,
                userId: contribution.membership.userId,
                tontineId: contribution.membership.tontineId,
                user: {
                    id: contribution.membership.user.id,
                    firstName: contribution.membership.user.firstName,
                    lastName: contribution.membership.user.lastName,
                    email: contribution.membership.user.email,
                },
            },

            cycle: {
                id: contribution.cycle.id,
                number: contribution.cycle.number,
                name: contribution.cycle.name,
                status: contribution.cycle.status,
            },

            payment: contribution.payment
                ? {
                      id: contribution.payment.id,
                      method: contribution.payment.method,
                      amount: Number(contribution.payment.amount),
                      status: contribution.payment.status,
                      transactionReference:
                          contribution.payment.transactionReference,
                      receiptNumber: contribution.payment.receiptNumber,
                      paidAt: contribution.payment.paidAt,
                  }
                : null,

            penalty: contribution.penalty
                ? {
                      id: contribution.penalty.id,
                      amount: Number(contribution.penalty.amount),
                      reason: contribution.penalty.reason,
                      status: contribution.penalty.status,
                  }
                : null,
        };
    }

    override toListItem(
        contribution: ContributionWithRelations,
    ): ContributionListItemDto {

        return {
            id: contribution.id,

            membershipId: contribution.membershipId,

            cycleId: contribution.cycleId,

            amount: Number(contribution.amount),

            status: contribution.status,

            paidAt: contribution.paidAt,

            validatedAt: contribution.validatedAt,

            createdAt: contribution.createdAt,
        };
    }
}
