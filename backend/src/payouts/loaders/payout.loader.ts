import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { payoutDetailsInclude, payoutOrderDetailsInclude } from '../payout.prisma';

@Injectable()
export class PayoutLoader {
    constructor(private readonly prisma: PrismaService) {}

    async findById(
        payoutId: string,
        db: PrismaService | Prisma.TransactionClient = this.prisma,
    ) {
        return db.payout.findUnique({
            where: { id: payoutId },
            include: payoutDetailsInclude,
        });
    }

    async findByCycleId(
        cycleId: string,
        db: PrismaService | Prisma.TransactionClient = this.prisma,
    ) {
        return db.payout.findUnique({
            where: { cycleId },
            include: payoutDetailsInclude,
        });
    }

    async findMany(
        where: Prisma.PayoutWhereInput,
        skip: number,
        take: number,
        db: PrismaService | Prisma.TransactionClient = this.prisma,
    ) {
        return db.payout.findMany({
            where,
            include: payoutDetailsInclude,
            skip,
            take,
            orderBy: { createdAt: 'desc' },
        });
    }

    async count(
        where: Prisma.PayoutWhereInput,
        db: PrismaService | Prisma.TransactionClient = this.prisma,
    ) {
        return db.payout.count({ where });
    }

    async findOrdersByTontine(
        tontineId: string,
        db: PrismaService | Prisma.TransactionClient = this.prisma,
    ) {
        return db.payoutOrder.findMany({
            where: { tontineId },
            include: payoutOrderDetailsInclude,
            orderBy: { sequence: 'asc' },
        });
    }

    async findOrderById(
        orderId: string,
        db: PrismaService | Prisma.TransactionClient = this.prisma,
    ) {
        return db.payoutOrder.findUnique({
            where: { id: orderId },
            include: payoutOrderDetailsInclude,
        });
    }
}
