import { Injectable } from '@nestjs/common';

import { MembershipStatus } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

import { MEMBERSHIP_INCLUDE } from '../includes';

import { MembershipNotFoundException } from '../../common/exceptions';

@Injectable()
export class MembershipsLoader {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async byId(id: string) {
        const membership =
            await this.prisma.membership.findUnique({
                where: { id },
                include: MEMBERSHIP_INCLUDE,
            });

        if (!membership) {
            throw new MembershipNotFoundException();
        }

        return membership;
    }

    async byUserAndTontine(
        userId: string,
        tontineId: string,
    ) {
        return this.prisma.membership.findUnique({
            where: {
                userId_tontineId: {
                    userId,
                    tontineId,
                },
            },
            include: MEMBERSHIP_INCLUDE,
        });
    }

    async activeMembers(tontineId: string) {
        return this.prisma.membership.findMany({
            where: {
                tontineId,
                status: MembershipStatus.ACTIVE,
            },
            include: MEMBERSHIP_INCLUDE,
        });
    }

    async countActive(
        tontineId: string,
    ): Promise<number> {
        return this.prisma.membership.count({
            where: {
                tontineId,
                status: MembershipStatus.ACTIVE,
            },
        });
    }

    async manager(
        tontineId: string,
    ) {
        return this.prisma.membership.findFirst({
            where: {
                tontineId,
                role: 'MANAGER',
                status: MembershipStatus.ACTIVE,
            },
            include: MEMBERSHIP_INCLUDE,
        });
    }

    async exists(id: string): Promise<boolean> {
        const count =
            await this.prisma.membership.count({
                where: { id },
            });

        return count > 0;
    }

    async findMany(where: any, skip: number, take: number) {
        return this.prisma.membership.findMany({
            where,
            skip,
            take,
            include: MEMBERSHIP_INCLUDE,
        });
    }

    async count(where: any): Promise<number> {
        return this.prisma.membership.count({ where });
    }
}