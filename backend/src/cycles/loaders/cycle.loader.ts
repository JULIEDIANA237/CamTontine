import { Injectable } from '@nestjs/common';

import {
    Prisma,
    PrismaClient,
} from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

import {
    cycleDetailsInclude,
} from '../cycle.prisma';

@Injectable()
export class CycleLoader {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async findById(
        cycleId: string,
        db:
            | PrismaService
            | Prisma.TransactionClient = this.prisma,
    ) {
        return db.cycle.findUnique({
            where: {
                id: cycleId,
            },

            include: cycleDetailsInclude,
        });
    }

    async findByIdAndTontine(
        tontineId: string,
        cycleId: string,
        db:
            | PrismaService
            | Prisma.TransactionClient = this.prisma,
    ) {
        return db.cycle.findFirst({
            where: {
                id: cycleId,
                tontineId,
            },

            include: cycleDetailsInclude,
        });
    }

    async findCurrent(
        tontineId: string,
        db:
            | PrismaService
            | Prisma.TransactionClient = this.prisma,
    ) {
        return db.cycle.findFirst({
            where: {
                tontineId,
                isCurrent: true,
            },

            include: cycleDetailsInclude,
        });
    }

    async findMany(
        where: Prisma.CycleWhereInput,
        skip: number,
        take: number,
        db:
            | PrismaService
            | Prisma.TransactionClient = this.prisma,
    ) {
        return db.cycle.findMany({
            where,

            include: cycleDetailsInclude,

            skip,

            take,

            orderBy: {
                number: 'asc',
            },
        });
    }

    async count(
        where: Prisma.CycleWhereInput,
        db:
            | PrismaService
            | Prisma.TransactionClient = this.prisma,
    ) {
        return db.cycle.count({
            where,
        });
    }
}