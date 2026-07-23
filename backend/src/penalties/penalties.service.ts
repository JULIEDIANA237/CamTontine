import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ApiResponse } from '../common/responses';
import { PenaltyMessages } from '../common/messages/penalty.messages';
import { PenaltyMapper } from './mappers/penalty.mapper';
import { PenaltyLoader } from './loaders/penalty.loader';

import { CreatePenaltyDto } from './dto/requests/create-penalty.dto';
import { FindPenaltiesDto } from './dto/requests/find-penalties.dto';

import { penaltyDetailsInclude } from './penalty.prisma';

@Injectable()
export class PenaltiesService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly penaltyMapper: PenaltyMapper,
        private readonly penaltyLoader: PenaltyLoader,
    ) {}

    private async getPenaltyWithRelations(
        db: PrismaService | Prisma.TransactionClient,
        penaltyId: string,
    ) {
        return db.penalty.findUnique({
            where: { id: penaltyId },
            include: penaltyDetailsInclude,
        });
    }

    /**
     * Appliquer une pénalité à une contribution
     */
    async create(dto: CreatePenaltyDto) {
        return this.prisma.$transaction(async (tx) => {
            const contribution = await tx.contribution.findUnique({
                where: { id: dto.contributionId },
            });

            if (!contribution) {
                throw new NotFoundException(PenaltyMessages.CONTRIBUTION_NOT_FOUND);
            }

            const existing = await tx.penalty.findUnique({
                where: { contributionId: dto.contributionId },
            });

            if (existing) {
                throw new ConflictException(PenaltyMessages.ALREADY_EXISTS);
            }

            const created = await tx.penalty.create({
                data: {
                    contributionId: dto.contributionId,
                    amount: dto.amount,
                    reason: dto.reason,
                    status: 'UNPAID',
                },
            });

            const result = await this.getPenaltyWithRelations(tx, created.id);
            if (!result) {
                throw new NotFoundException('Pénalité introuvable après création.');
            }

            return ApiResponse.created(
                this.penaltyMapper.toResponse(result),
                PenaltyMessages.CREATED,
            );
        });
    }

    /**
     * Marquer une pénalité comme payée (PAID)
     */
    async markAsPaid(penaltyId: string) {
        return this.prisma.$transaction(async (tx) => {
            const penalty = await tx.penalty.findUnique({
                where: { id: penaltyId },
            });

            if (!penalty) {
                throw new NotFoundException(PenaltyMessages.NOT_FOUND);
            }

            if (penalty.status !== 'UNPAID') {
                throw new BadRequestException(PenaltyMessages.INVALID_STATUS);
            }

            await tx.penalty.update({
                where: { id: penaltyId },
                data: { status: 'PAID' },
            });

            const result = await this.getPenaltyWithRelations(tx, penaltyId);
            if (!result) {
                throw new NotFoundException('Pénalité introuvable après mise à jour.');
            }

            return ApiResponse.success(
                this.penaltyMapper.toResponse(result),
                PenaltyMessages.PAID,
            );
        });
    }

    /**
     * Exonérer / annuler une pénalité (WAIVED)
     */
    async waive(penaltyId: string) {
        return this.prisma.$transaction(async (tx) => {
            const penalty = await tx.penalty.findUnique({
                where: { id: penaltyId },
            });

            if (!penalty) {
                throw new NotFoundException(PenaltyMessages.NOT_FOUND);
            }

            if (penalty.status !== 'UNPAID') {
                throw new BadRequestException(PenaltyMessages.INVALID_STATUS);
            }

            await tx.penalty.update({
                where: { id: penaltyId },
                data: { status: 'WAIVED' },
            });

            const result = await this.getPenaltyWithRelations(tx, penaltyId);
            if (!result) {
                throw new NotFoundException('Pénalité introuvable après exonération.');
            }

            return ApiResponse.success(
                this.penaltyMapper.toResponse(result),
                PenaltyMessages.WAIVED,
            );
        });
    }

    /**
     * Lister les pénalités avec filtres et pagination
     */
    async findAll(query: FindPenaltiesDto) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 20;
        const skip = (page - 1) * limit;

        const where: Prisma.PenaltyWhereInput = {};

        if (query.status) {
            where.status = query.status;
        }

        if (query.contributionId) {
            where.contributionId = query.contributionId;
        }

        const [penalties, total] = await Promise.all([
            this.penaltyLoader.findMany(where, skip, limit),
            this.penaltyLoader.count(where),
        ]);

        return ApiResponse.success(
            this.penaltyMapper.toPaginatedResponse(penalties, {
                page,
                limit,
                total,
            }),
            PenaltyMessages.LIST,
        );
    }

    /**
     * Obtenir une pénalité par ID
     */
    async findOne(penaltyId: string) {
        const penalty = await this.penaltyLoader.findById(penaltyId);

        if (!penalty) {
            throw new NotFoundException(PenaltyMessages.NOT_FOUND);
        }

        return ApiResponse.success(
            this.penaltyMapper.toResponse(penalty),
            PenaltyMessages.FOUND,
        );
    }
}
