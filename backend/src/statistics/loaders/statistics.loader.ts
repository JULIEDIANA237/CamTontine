import { Injectable } from '@nestjs/common';

import {
    ContributionStatus,
    MembershipStatus,
    PaymentStatus,
    PayoutStatus,
    Prisma,
    TontineStatus,
    UserStatus,
} from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StatisticsLoader {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    // =============================
    // ADMIN
    // =============================

    async getAdminStatistics() {
        const [
            users,
            activeUsers,
            tontines,
            activeTontines,
            memberships,
            activeMemberships,
            cycles,
            contributions,
            validatedContributions,
            payments,
            successfulPayments,
            payouts,
            paidPayouts,
            penalties,
        ] = await Promise.all([
            this.prisma.user.count(),

            this.prisma.user.count({
                where: {
                    status: UserStatus.ACTIVE,
                },
            }),

            this.prisma.tontine.count(),

            this.prisma.tontine.count({
                where: {
                    status: TontineStatus.ACTIVE,
                },
            }),

            this.prisma.membership.count(),

            this.prisma.membership.count({
                where: {
                    status: MembershipStatus.ACTIVE,
                },
            }),

            this.prisma.cycle.count(),

            this.prisma.contribution.count(),

            this.prisma.contribution.count({
                where: {
                    status: ContributionStatus.VALIDATED,
                },
            }),

            this.prisma.payment.count(),

            this.prisma.payment.count({
                where: {
                    status: PaymentStatus.SUCCESS,
                },
            }),

            this.prisma.payout.count(),

            this.prisma.payout.count({
                where: {
                    status: PayoutStatus.PAID,
                },
            }),

            this.prisma.penalty.count(),
        ]);

        return {
            users,
            activeUsers,

            tontines,
            activeTontines,

            memberships,
            activeMemberships,

            cycles,

            contributions,
            validatedContributions,

            payments,
            successfulPayments,

            payouts,
            paidPayouts,

            penalties,
        };
    }

    // =============================
    // TONTINE
    // =============================

    async getTontineStatistics(
        tontineId: string,
    ) {
        const [
            members,

            activeMembers,

            currentCycle,

            contributions,

            validatedContributions,

            payoutOrders,
        ] = await Promise.all([
            this.prisma.membership.count({
                where: {
                    tontineId,
                },
            }),

            this.prisma.membership.count({
                where: {
                    tontineId,
                    status: MembershipStatus.ACTIVE,
                },
            }),

            this.prisma.cycle.findFirst({
                where: {
                    tontineId,
                    isCurrent: true,
                },
            }),

            this.prisma.contribution.count({
                where: {
                    membership: {
                        tontineId,
                    },
                },
            }),

            this.prisma.contribution.count({
                where: {
                    membership: {
                        tontineId,
                    },
                    status:
                        ContributionStatus.VALIDATED,
                },
            }),

            this.prisma.payoutOrder.count({
                where: {
                    tontineId,
                },
            }),
        ]);

        return {
            members,
            activeMembers,

            currentCycle,

            contributions,

            validatedContributions,

            payoutOrders,
        };
    }

    // =============================
    // MEMBRE
    // =============================

    async getMemberStatistics(
        membershipId: string,
    ) {
        const [
            contributions,

            validatedContributions,

            penalties,

            payouts,
        ] = await Promise.all([
            this.prisma.contribution.count({
                where: {
                    membershipId,
                },
            }),

            this.prisma.contribution.count({
                where: {
                    membershipId,
                    status:
                        ContributionStatus.VALIDATED,
                },
            }),

            this.prisma.penalty.count({
                where: {
                    contribution: {
                        membershipId,
                    },
                },
            }),

            this.prisma.payout.count({
                where: {
                    beneficiaryMembershipId:
                        membershipId,
                },
            }),
        ]);

        return {
            contributions,

            validatedContributions,

            penalties,

            payouts,
        };
    }
}