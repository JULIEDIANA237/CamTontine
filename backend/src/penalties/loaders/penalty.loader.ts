import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { penaltyDetailsInclude } from '../penalty.prisma';

@Injectable()
export class PenaltyLoader {
    constructor(private readonly prisma: PrismaService) {}

    async findById(
        penaltyId: string,
        db: PrismaService | Prisma.TransactionClient = this.prisma,
    ) {
        return db.penalty.findUnique({
            where: { id: penaltyId },
            include: penaltyDetailsInclude,
        });
    }

    async findByContributionId(
        contributionId: string,
        db: PrismaService | Prisma.TransactionClient = this.prisma,
    ) {
        return db.penalty.findUnique({
            where: { contributionId },
            include: penaltyDetailsInclude,
        });
    }

    async findMany(
        where: Prisma.PenaltyWhereInput,
        skip: number,
        take: number,
        db: PrismaService | Prisma.TransactionClient = this.prisma,
    ) {
        return db.penalty.findMany({
            where,
            include: penaltyDetailsInclude,
            skip,
            take,
            orderBy: { createdAt: 'desc' },
        });
    }

    async count(
        where: Prisma.PenaltyWhereInput,
        db: PrismaService | Prisma.TransactionClient = this.prisma,
    ) {
        return db.penalty.count({ where });
    }
}
