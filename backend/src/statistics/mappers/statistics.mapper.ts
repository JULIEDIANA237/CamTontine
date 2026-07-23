import { Injectable } from '@nestjs/common';

import { BaseMapper } from '../../common/mappers';

import { AdminStatisticsResponseDto } from '../dto/responses/admin-statistics-response.dto';
import { MemberStatisticsResponseDto } from '../dto/responses/member-statistics-response.dto';
import { TontineStatisticsResponseDto } from '../dto/responses/tontine-statistics-response.dto';

@Injectable()
export class StatisticsMapper extends BaseMapper<any, any> {

    /**
     * Non utilisé directement.
     */
    override toResponse(): never {
        throw new Error(
            'Utiliser les méthodes spécialisées du StatisticsMapper.',
        );
    }

    // =====================================================
    // ADMIN
    // =====================================================

    toAdminResponse(
        statistics: any,
    ): AdminStatisticsResponseDto {
        return {
            users: statistics.users,

            activeUsers: statistics.activeUsers,

            suspendedUsers:
                statistics.users -
                statistics.activeUsers,

            tontines: statistics.tontines,

            activeTontines:
                statistics.activeTontines,

            completedTontines:
                statistics.completedTontines ?? 0,

            memberships:
                statistics.memberships,

            activeMemberships:
                statistics.activeMemberships,

            cycles:
                statistics.cycles,

            contributions:
                statistics.contributions,

            validatedContributions:
                statistics.validatedContributions,

            payments:
                statistics.payments,

            successfulPayments:
                statistics.successfulPayments,

            payouts:
                statistics.payouts,

            paidPayouts:
                statistics.paidPayouts,

            penalties:
                statistics.penalties,

            totalCollected:
                statistics.totalCollected ?? 0,

            totalPaid:
                statistics.totalPaid ?? 0,

            totalPenalties:
                statistics.totalPenalties ?? 0,
        };
    }

    // =====================================================
    // TONTINE
    // =====================================================

    toTontineResponse(
        statistics: any,
    ): TontineStatisticsResponseDto {

        const expectedAmount =
            Number(
                statistics.currentCycle
                    ?.expectedAmount ?? 0,
            );

        const collectedAmount =
            Number(
                statistics.currentCycle
                    ?.collectedAmount ?? 0,
            );

        const remainingAmount =
            expectedAmount -
            collectedAmount;

        const completionRate =
            expectedAmount === 0
                ? 0
                : Math.round(
                    (collectedAmount /
                        expectedAmount) *
                    100,
                );

        return {

            members:
                statistics.members,

            activeMembers:
                statistics.activeMembers,

            currentCycle:
                statistics.currentCycle
                    ?.number ?? null,

            completedCycles:
                statistics.completedCycles ??
                0,

            expectedAmount,

            collectedAmount,

            remainingAmount,

            validatedContributions:
                statistics.validatedContributions,

            pendingContributions:
                statistics.contributions -
                statistics.validatedContributions,

            penalties:
                statistics.penalties ?? 0,

            completionRate,

            payoutOrders:
                statistics.payoutOrders,
        };
    }

    // =====================================================
    // MEMBRE
    // =====================================================

    toMemberResponse(
        statistics: any,
    ): MemberStatisticsResponseDto {

        return {

            totalContributions:
                statistics.contributions,

            validatedContributions:
                statistics.validatedContributions,

            pendingContributions:
                statistics.contributions -
                statistics.validatedContributions,

            totalPaid:
                statistics.totalPaid ?? 0,

            penalties:
                statistics.penalties,

            payoutsReceived:
                statistics.payouts,

            nextTurn:
                statistics.nextTurn ?? null,
        };
    }
}