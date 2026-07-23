import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { invitationDetailsInclude } from '../invitation.prisma';

@Injectable()
export class InvitationLoader {
    constructor(private readonly prisma: PrismaService) {}

    async findById(
        invitationId: string,
        db: PrismaService | Prisma.TransactionClient = this.prisma,
    ) {
        return db.invitation.findUnique({
            where: { id: invitationId },
            include: invitationDetailsInclude,
        });
    }

    async findByToken(
        token: string,
        db: PrismaService | Prisma.TransactionClient = this.prisma,
    ) {
        return db.invitation.findUnique({
            where: { token },
            include: invitationDetailsInclude,
        });
    }

    async findMany(
        where: Prisma.InvitationWhereInput,
        skip: number,
        take: number,
        db: PrismaService | Prisma.TransactionClient = this.prisma,
    ) {
        return db.invitation.findMany({
            where,
            include: invitationDetailsInclude,
            skip,
            take,
            orderBy: { createdAt: 'desc' },
        });
    }

    async count(
        where: Prisma.InvitationWhereInput,
        db: PrismaService | Prisma.TransactionClient = this.prisma,
    ) {
        return db.invitation.count({ where });
    }
}
