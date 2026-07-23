import { Injectable } from '@nestjs/common';
import { BaseMapper } from '../../common/mappers';
import { PenaltyResponseDto } from '../dto/responses/penalty-response.dto';
import { PenaltyListItemDto } from '../dto/responses/penalty-list-item.dto';
import { PenaltyWithRelations } from '../penalty.prisma';

@Injectable()
export class PenaltyMapper extends BaseMapper<
    PenaltyWithRelations,
    PenaltyResponseDto,
    PenaltyListItemDto
> {
    override toResponse(penalty: PenaltyWithRelations): PenaltyResponseDto {
        return {
            id: penalty.id,
            contributionId: penalty.contributionId,
            amount: Number(penalty.amount),
            reason: penalty.reason,
            status: penalty.status,
            createdAt: penalty.createdAt,
            contribution: {
                id: penalty.contribution.id,
                cycleId: penalty.contribution.cycleId,
                user: {
                    id: penalty.contribution.membership.user.id,
                    firstName: penalty.contribution.membership.user.firstName,
                    lastName: penalty.contribution.membership.user.lastName,
                    email: penalty.contribution.membership.user.email,
                },
            },
        };
    }

    override toListItem(penalty: PenaltyWithRelations): PenaltyListItemDto {
        return {
            id: penalty.id,
            contributionId: penalty.contributionId,
            amount: Number(penalty.amount),
            reason: penalty.reason,
            status: penalty.status,
            createdAt: penalty.createdAt,
        };
    }
}
