import { Injectable } from '@nestjs/common';

import { BaseMapper } from '../../common/mappers';

import { CycleResponseDto } from '../dto/responses/cycle-response.dto';
import { CycleListItemDto } from '../dto/responses/cycle-list-item.dto';
import { BasicTontineDto } from '../../common/dto/responses/basic-tontine.dto';

import { CycleWithRelations } from '../cycle.prisma';

@Injectable()
export class CycleMapper
    extends BaseMapper<
        CycleWithRelations,
        CycleResponseDto,
        CycleListItemDto
    > {

    override toResponse(
        cycle: CycleWithRelations,
    ): CycleResponseDto {

        return {

            id: cycle.id,

            number: cycle.number,

            name: cycle.name,

            startDate: cycle.startDate,

            dueDate: cycle.dueDate,

            expectedAmount: Number(
                cycle.expectedAmount,
            ),

            collectedAmount: Number(
                cycle.collectedAmount,
            ),

            status: cycle.status,

            isCurrent: cycle.isCurrent,

            openedAt: cycle.openedAt,

            closedAt: cycle.closedAt,

            createdAt: cycle.createdAt,

            updatedAt: cycle.updatedAt,

            tontine: {
                id: cycle.tontine.id,

                name: cycle.tontine.name,
            },

            contributionCount:
                cycle._count.contributions,

            payoutId:
                cycle.payout?.id ?? null,
        };
    }

    override toListItem(
        cycle: CycleWithRelations,
    ): CycleListItemDto {

        return {

            id: cycle.id,

            number: cycle.number,

            name: cycle.name,

            dueDate: cycle.dueDate,

            status: cycle.status,

            expectedAmount: Number(
                cycle.expectedAmount,
            ),

            collectedAmount: Number(
                cycle.collectedAmount,
            ),

            isCurrent: cycle.isCurrent,

            createdAt: cycle.createdAt,
        };
    }

}
