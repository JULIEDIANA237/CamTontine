import { Injectable } from '@nestjs/common';

import {
    MembershipRole,
    MembershipStatus,
} from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MembershipAbilityService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async getMembershipRole(
        userId: string,
        tontineId: string,
    ): Promise<MembershipRole | null> {
        const membership =
            await this.prisma.membership.findFirst({
                where: {
                    userId,
                    tontineId,

                    status: MembershipStatus.ACTIVE,
                },

                select: {
                    role: true,
                },
            });

        return membership?.role ?? null;
    }

    async getMembership(
        userId: string,
        tontineId: string,
    ) {
        return this.prisma.membership.findFirst({
            where: {
                userId,
                tontineId,
                status: 'ACTIVE'
            }
        });
    }
}