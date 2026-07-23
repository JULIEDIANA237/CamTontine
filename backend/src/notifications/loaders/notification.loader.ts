import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { notificationDetailsInclude } from '../notification.prisma';

@Injectable()
export class NotificationLoader {
    constructor(private readonly prisma: PrismaService) {}

    async findById(
        notificationId: string,
        db: PrismaService | Prisma.TransactionClient = this.prisma,
    ) {
        return db.notification.findUnique({
            where: { id: notificationId },
            include: notificationDetailsInclude,
        });
    }

    async findMany(
        where: Prisma.NotificationWhereInput,
        skip: number,
        take: number,
        db: PrismaService | Prisma.TransactionClient = this.prisma,
    ) {
        return db.notification.findMany({
            where,
            include: notificationDetailsInclude,
            skip,
            take,
            orderBy: { createdAt: 'desc' },
        });
    }

    async count(
        where: Prisma.NotificationWhereInput,
        db: PrismaService | Prisma.TransactionClient = this.prisma,
    ) {
        return db.notification.count({ where });
    }
}
