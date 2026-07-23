import { Injectable } from '@nestjs/common';
import { BaseMapper } from '../../common/mappers';
import { PayoutResponseDto } from '../dto/responses/payout-response.dto';
import { PayoutListItemDto } from '../dto/responses/payout-list-item.dto';
import { PayoutWithRelations, PayoutOrderWithRelations } from '../payout.prisma';
import { PayoutOrderResponseDto } from '../dto/responses/payout-order-response.dto';

@Injectable()
export class PayoutMapper extends BaseMapper<
    PayoutWithRelations,
    PayoutResponseDto,
    PayoutListItemDto
> {
    override toResponse(payout: PayoutWithRelations): PayoutResponseDto {
        return {
            id: payout.id,
            cycleId: payout.cycleId,
            beneficiaryMembershipId: payout.beneficiaryMembershipId,
            amount: Number(payout.amount),
            status: payout.status,
            paidAt: payout.paidAt,
            note: payout.note,
            createdAt: payout.createdAt,
            cycle: {
                id: payout.cycle.id,
                number: payout.cycle.number,
                name: payout.cycle.name,
            },
            beneficiary: {
                id: payout.beneficiary.id,
                user: {
                    id: payout.beneficiary.user.id,
                    firstName: payout.beneficiary.user.firstName,
                    lastName: payout.beneficiary.user.lastName,
                    email: payout.beneficiary.user.email,
                },
            },
        };
    }

    override toListItem(payout: PayoutWithRelations): PayoutListItemDto {
        return {
            id: payout.id,
            cycleId: payout.cycleId,
            beneficiaryMembershipId: payout.beneficiaryMembershipId,
            amount: Number(payout.amount),
            status: payout.status,
            paidAt: payout.paidAt,
            createdAt: payout.createdAt,
        };
    }

    toOrderResponse(order: PayoutOrderWithRelations): PayoutOrderResponseDto {
        return {
            id: order.id,
            tontineId: order.tontineId,
            membershipId: order.membershipId,
            sequence: order.sequence,
            status: order.status,
            exchangedWithOrderId: order.exchangedWithOrderId,
            createdAt: order.createdAt,
            membership: {
                id: order.membership.id,
                user: {
                    id: order.membership.user.id,
                    firstName: order.membership.user.firstName,
                    lastName: order.membership.user.lastName,
                    email: order.membership.user.email,
                },
            },
        };
    }

    toOrderListResponse(orders: PayoutOrderWithRelations[]): PayoutOrderResponseDto[] {
        return orders.map((o) => this.toOrderResponse(o));
    }
}
