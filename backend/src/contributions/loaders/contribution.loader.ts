import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { contributionDetailsInclude } from '../contribution.prisma';

@Injectable()
export class ContributionLoader {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async findById(
        contributionId: string,
        db: PrismaService | Prisma.TransactionClient = this.prisma,
    ) {
        return db.contribution.findUnique({
            where: { id: contributionId },
            include: contributionDetailsInclude,
        });
    }

    async findByIdAndCycle(
        cycleId: string,
        contributionId: string,
        db: PrismaService | Prisma.TransactionClient = this.prisma,
    ) {
        return db.contribution.findFirst({
            where: {
                id: contributionId,
                cycleId,
            },
            include: contributionDetailsInclude,
        });
    }

    async findMany(
        where: Prisma.ContributionWhereInput,
        skip: number,
        take: number,
        db: PrismaService | Prisma.TransactionClient = this.prisma,
    ) {
        return db.contribution.findMany({
            where,
            include: contributionDetailsInclude,
            skip,
            take,
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async count(
        where: Prisma.ContributionWhereInput,
        db: PrismaService | Prisma.TransactionClient = this.prisma,
    ) {
        return db.contribution.count({ where });
    }
}
