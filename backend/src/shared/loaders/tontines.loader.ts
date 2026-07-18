import { Injectable } from '@nestjs/common';

import { TontineStatus } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

import { TONTINE_INCLUDE } from '../includes';

import { TontineNotFoundException } from '../../common/exceptions';

@Injectable()
export class TontinesLoader {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async byId(id: string) {
        const tontine =
            await this.prisma.tontine.findUnique({
                where: { id },
                include: TONTINE_INCLUDE,
            });

        if (!tontine) {
            throw new TontineNotFoundException();
        }

        return tontine;
    }

    async byIdWithoutRelations(id: string) {
        const tontine =
            await this.prisma.tontine.findUnique({
                where: { id },
            });

        if (!tontine) {
            throw new TontineNotFoundException();
        }

        return tontine;
    }

    async active(id: string) {
        const tontine =
            await this.byIdWithoutRelations(id);

        if (
            tontine.status === TontineStatus.ARCHIVED
        ) {
            throw new TontineNotFoundException();
        }

        return tontine;
    }

    async exists(id: string): Promise<boolean> {
        const count =
            await this.prisma.tontine.count({
                where: { id },
            });

        return count > 0;
    }

    async findMany(where: any, skip: number, take: number): Promise<any[]> {
        return this.prisma.tontine.findMany({
            where,
            skip,
            take,
            include: TONTINE_INCLUDE,
        });
    }

    async count(where: any): Promise<number> {
        return this.prisma.tontine.count({ where });
    }
}