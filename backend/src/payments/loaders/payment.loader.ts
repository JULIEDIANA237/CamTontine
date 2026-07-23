import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { paymentDetailsInclude } from '../payment.prisma';

@Injectable()
export class PaymentLoader {
    constructor(private readonly prisma: PrismaService) {}

    async findById(
        paymentId: string,
        db: PrismaService | Prisma.TransactionClient = this.prisma,
    ) {
        return db.payment.findUnique({
            where: { id: paymentId },
            include: paymentDetailsInclude,
        });
    }

    async findByContributionId(
        contributionId: string,
        db: PrismaService | Prisma.TransactionClient = this.prisma,
    ) {
        return db.payment.findUnique({
            where: { contributionId },
            include: paymentDetailsInclude,
        });
    }

    async findMany(
        where: Prisma.PaymentWhereInput,
        skip: number,
        take: number,
        db: PrismaService | Prisma.TransactionClient = this.prisma,
    ) {
        return db.payment.findMany({
            where,
            include: paymentDetailsInclude,
            skip,
            take,
            orderBy: { createdAt: 'desc' },
        });
    }

    async count(
        where: Prisma.PaymentWhereInput,
        db: PrismaService | Prisma.TransactionClient = this.prisma,
    ) {
        return db.payment.count({ where });
    }
}
