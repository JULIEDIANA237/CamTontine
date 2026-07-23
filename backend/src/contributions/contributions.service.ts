import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { ApiResponse } from '../common/responses';
import { ContributionMessages } from '../common/messages/contribution.messages';
import { ContributionMapper } from './mappers/contribution.mapper';
import { ContributionLoader } from './loaders/contribution.loader';

import { CreateContributionDto } from './dto/requests/create-contribution.dto';
import { UpdateContributionDto } from './dto/requests/update-contribution.dto';
import { FindContributionsDto } from './dto/requests/find-contributions.dto';
import { ValidateContributionDto } from './dto/requests/validate-contribution.dto';
import { CancelContributionDto } from './dto/requests/cancel-contribution.dto';

import { contributionDetailsInclude } from './contribution.prisma';

@Injectable()
export class ContributionsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly contributionMapper: ContributionMapper,
        private readonly contributionLoader: ContributionLoader,
    ) { }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    private async getContributionWithRelations(
        db: PrismaService | Prisma.TransactionClient,
        cycleId: string,
        contributionId: string,
    ) {
        return db.contribution.findFirst({
            where: { id: contributionId, cycleId },
            include: contributionDetailsInclude,
        });
    }

    // ─── Create ───────────────────────────────────────────────────────────────

    /**
     * Créer une contribution pour un membre dans un cycle
     * Route: POST /tontines/:tontineId/cycles/:cycleId/contributions
     */
    async create(
        tontineId: string,
        cycleId: string,
        dto: CreateContributionDto,
    ) {
        return this.prisma.$transaction(async (tx) => {
            // Vérifier que le cycle existe et appartient à la tontine
            const cycle = await tx.cycle.findFirst({
                where: { id: cycleId, tontineId },
            });

            if (!cycle) {
                throw new NotFoundException('Cycle introuvable.');
            }

            // Le cycle doit être ouvert
            if (cycle.status !== 'OPEN') {
                throw new BadRequestException(
                    ContributionMessages.CYCLE_NOT_OPEN,
                );
            }

            // Vérifier que le membre existe et est actif dans la tontine
            const membership = await tx.membership.findFirst({
                where: {
                    id: dto.membershipId,
                    tontineId,
                    status: 'ACTIVE',
                },
            });

            if (!membership) {
                throw new NotFoundException(
                    ContributionMessages.MEMBER_NOT_ACTIVE,
                );
            }

            // Vérifier qu'une contribution n'existe pas déjà pour ce membre dans ce cycle
            const existing = await tx.contribution.findUnique({
                where: {
                    membershipId_cycleId: {
                        membershipId: dto.membershipId,
                        cycleId,
                    },
                },
            });

            if (existing) {
                throw new ConflictException(
                    ContributionMessages.ALREADY_EXISTS,
                );
            }

            const created = await tx.contribution.create({
                data: {
                    membershipId: dto.membershipId,
                    cycleId,
                    amount: dto.amount,
                    status: 'PENDING',
                },
            });

            const result = await this.getContributionWithRelations(
                tx,
                cycleId,
                created.id,
            );

            if (!result) {
                throw new NotFoundException('Contribution introuvable après création.');
            }

            return ApiResponse.created(
                this.contributionMapper.toResponse(result),
                ContributionMessages.CREATED,
            );
        });
    }

    // ─── Find All ─────────────────────────────────────────────────────────────

    /**
     * Lister les contributions d'un cycle avec pagination et filtres
     * Route: GET /tontines/:tontineId/cycles/:cycleId/contributions
     */
    async findAll(
        tontineId: string,
        cycleId: string,
        query: FindContributionsDto,
    ) {
        // Vérifier que le cycle appartient à la tontine
        const cycle = await this.prisma.cycle.findFirst({
            where: { id: cycleId, tontineId },
        });

        if (!cycle) {
            throw new NotFoundException('Cycle introuvable.');
        }

        const page = query.page ?? 1;
        const limit = query.limit ?? 20;
        const skip = (page - 1) * limit;

        const where: Prisma.ContributionWhereInput = { cycleId };

        if (query.status) {
            where.status = query.status;
        }

        if (query.membershipId) {
            where.membershipId = query.membershipId;
        }

        const [contributions, total] = await Promise.all([
            this.contributionLoader.findMany(where, skip, limit),
            this.contributionLoader.count(where),
        ]);

        return ApiResponse.success(
            this.contributionMapper.toPaginatedResponse(contributions, {
                page,
                limit,
                total,
            }),
            ContributionMessages.LIST,
        );
    }

    // ─── Find One ─────────────────────────────────────────────────────────────

    /**
     * Récupérer une contribution par son ID
     * Route: GET /tontines/:tontineId/cycles/:cycleId/contributions/:contributionId
     */
    async findOne(
        tontineId: string,
        cycleId: string,
        contributionId: string,
    ) {
        // Vérifier que le cycle appartient à la tontine
        const cycle = await this.prisma.cycle.findFirst({
            where: { id: cycleId, tontineId },
        });

        if (!cycle) {
            throw new NotFoundException('Cycle introuvable.');
        }

        const contribution = await this.contributionLoader.findByIdAndCycle(
            cycleId,
            contributionId,
        );

        if (!contribution) {
            throw new NotFoundException(ContributionMessages.NOT_FOUND);
        }

        return ApiResponse.success(
            this.contributionMapper.toResponse(contribution),
            ContributionMessages.FOUND,
        );
    }

    // ─── Update ───────────────────────────────────────────────────────────────

    /**
     * Mettre à jour une contribution (montant)
     * Route: PATCH /tontines/:tontineId/cycles/:cycleId/contributions/:contributionId
     */
    async update(
        tontineId: string,
        cycleId: string,
        contributionId: string,
        dto: UpdateContributionDto,
    ) {
        const cycle = await this.prisma.cycle.findFirst({
            where: { id: cycleId, tontineId },
        });

        if (!cycle) {
            throw new NotFoundException('Cycle introuvable.');
        }

        const contribution = await this.contributionLoader.findByIdAndCycle(
            cycleId,
            contributionId,
        );

        if (!contribution) {
            throw new NotFoundException(ContributionMessages.NOT_FOUND);
        }

        if (
            contribution.status === 'VALIDATED' ||
            contribution.status === 'CANCELLED'
        ) {
            throw new BadRequestException(ContributionMessages.CANNOT_CANCEL);
        }

        const data: Prisma.ContributionUpdateInput = {};

        if (dto.amount !== undefined) {
            data.amount = dto.amount;
        }

        await this.prisma.contribution.update({
            where: { id: contributionId },
            data,
        });

        const result = await this.contributionLoader.findByIdAndCycle(
            cycleId,
            contributionId,
        );

        if (!result) {
            throw new NotFoundException('Contribution introuvable après mise à jour.');
        }

        return ApiResponse.success(
            this.contributionMapper.toResponse(result),
            ContributionMessages.UPDATED,
        );
    }

    // ─── Validate ─────────────────────────────────────────────────────────────

    /**
     * Valider une contribution (PAID → VALIDATED)
     * Route: PATCH /tontines/:tontineId/cycles/:cycleId/contributions/:contributionId/validate
     */
    async validate(
        tontineId: string,
        cycleId: string,
        contributionId: string,
        _dto?: ValidateContributionDto,
    ) {
        return this.prisma.$transaction(async (tx) => {
            const cycle = await tx.cycle.findFirst({
                where: { id: cycleId, tontineId },
            });

            if (!cycle) {
                throw new NotFoundException('Cycle introuvable.');
            }

            const contribution = await tx.contribution.findFirst({
                where: { id: contributionId, cycleId },
            });

            if (!contribution) {
                throw new NotFoundException(ContributionMessages.NOT_FOUND);
            }

            if (contribution.status !== 'PAID') {
                throw new BadRequestException(
                    ContributionMessages.CANNOT_VALIDATE,
                );
            }

            await tx.contribution.update({
                where: { id: contributionId },
                data: {
                    status: 'VALIDATED',
                    validatedAt: new Date(),
                },
            });

            // Mettre à jour le montant collecté du cycle
            await tx.cycle.update({
                where: { id: cycleId },
                data: {
                    collectedAmount: {
                        increment: contribution.amount,
                    },
                },
            });

            const result = await this.getContributionWithRelations(
                tx,
                cycleId,
                contributionId,
            );

            if (!result) {
                throw new NotFoundException('Contribution introuvable après validation.');
            }

            return ApiResponse.success(
                this.contributionMapper.toResponse(result),
                ContributionMessages.VALIDATED,
            );
        });
    }

    // ─── Cancel ───────────────────────────────────────────────────────────────

    /**
     * Annuler une contribution
     * Route: PATCH /tontines/:tontineId/cycles/:cycleId/contributions/:contributionId/cancel
     */
    async cancel(
        tontineId: string,
        cycleId: string,
        contributionId: string,
        _dto?: CancelContributionDto,
    ) {
        return this.prisma.$transaction(async (tx) => {
            const cycle = await tx.cycle.findFirst({
                where: { id: cycleId, tontineId },
            });

            if (!cycle) {
                throw new NotFoundException('Cycle introuvable.');
            }

            const contribution = await tx.contribution.findFirst({
                where: { id: contributionId, cycleId },
            });

            if (!contribution) {
                throw new NotFoundException(ContributionMessages.NOT_FOUND);
            }

            if (contribution.status === 'CANCELLED') {
                throw new BadRequestException(
                    ContributionMessages.CANNOT_CANCEL,
                );
            }

            // Si la contribution était VALIDATED, on décrémente le montant collecté
            const wasValidated = contribution.status === 'VALIDATED';

            await tx.contribution.update({
                where: { id: contributionId },
                data: {
                    status: 'CANCELLED',
                },
            });

            if (wasValidated) {
                await tx.cycle.update({
                    where: { id: cycleId },
                    data: {
                        collectedAmount: {
                            decrement: contribution.amount,
                        },
                    },
                });
            }

            const result = await this.getContributionWithRelations(
                tx,
                cycleId,
                contributionId,
            );

            if (!result) {
                throw new NotFoundException('Contribution introuvable après annulation.');
            }

            return ApiResponse.success(
                this.contributionMapper.toResponse(result),
                ContributionMessages.CANCELLED,
            );
        });
    }
}
