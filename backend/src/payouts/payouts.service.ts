import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ApiResponse } from '../common/responses';
import { PayoutMessages } from '../common/messages/payout.messages';
import { PayoutMapper } from './mappers/payout.mapper';
import { PayoutLoader } from './loaders/payout.loader';

import { CreatePayoutDto } from './dto/requests/create-payout.dto';
import { FindPayoutsDto } from './dto/requests/find-payouts.dto';
import { GeneratePayoutOrdersDto } from './dto/requests/generate-payout-orders.dto';
import { SwapPayoutOrdersDto } from './dto/requests/swap-payout-orders.dto';

import { payoutDetailsInclude, payoutOrderDetailsInclude } from './payout.prisma';

@Injectable()
export class PayoutsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly payoutMapper: PayoutMapper,
        private readonly payoutLoader: PayoutLoader,
    ) {}

    private async getPayoutWithRelations(
        db: PrismaService | Prisma.TransactionClient,
        payoutId: string,
    ) {
        return db.payout.findUnique({
            where: { id: payoutId },
            include: payoutDetailsInclude,
        });
    }

    /**
     * Créer une distribution (payout) pour un cycle
     */
    async create(dto: CreatePayoutDto) {
        return this.prisma.$transaction(async (tx) => {
            const cycle = await tx.cycle.findUnique({
                where: { id: dto.cycleId },
            });

            if (!cycle) {
                throw new NotFoundException(PayoutMessages.CYCLE_NOT_FOUND);
            }

            const existing = await tx.payout.findUnique({
                where: { cycleId: dto.cycleId },
            });

            if (existing) {
                throw new ConflictException(PayoutMessages.ALREADY_EXISTS);
            }

            const beneficiary = await tx.membership.findFirst({
                where: {
                    id: dto.beneficiaryMembershipId,
                    tontineId: cycle.tontineId,
                },
            });

            if (!beneficiary) {
                throw new NotFoundException(PayoutMessages.BENEFICIARY_NOT_FOUND);
            }

            const created = await tx.payout.create({
                data: {
                    cycleId: dto.cycleId,
                    beneficiaryMembershipId: dto.beneficiaryMembershipId,
                    amount: dto.amount,
                    note: dto.note,
                    status: 'PENDING',
                },
            });

            const result = await this.getPayoutWithRelations(tx, created.id);
            if (!result) {
                throw new NotFoundException('Distribution introuvable après création.');
            }

            return ApiResponse.created(
                this.payoutMapper.toResponse(result),
                PayoutMessages.CREATED,
            );
        });
    }

    /**
     * Effectuer/Valider un payout (Marquer PAID)
     */
    async process(payoutId: string) {
        return this.prisma.$transaction(async (tx) => {
            const payout = await tx.payout.findUnique({
                where: { id: payoutId },
            });

            if (!payout) {
                throw new NotFoundException(PayoutMessages.NOT_FOUND);
            }

            if (payout.status !== 'PENDING') {
                throw new BadRequestException(PayoutMessages.INVALID_STATUS);
            }

            await tx.payout.update({
                where: { id: payoutId },
                data: {
                    status: 'PAID',
                    paidAt: new Date(),
                },
            });

            const result = await this.getPayoutWithRelations(tx, payoutId);
            if (!result) {
                throw new NotFoundException('Distribution introuvable après traitement.');
            }

            return ApiResponse.success(
                this.payoutMapper.toResponse(result),
                PayoutMessages.PROCESSED,
            );
        });
    }

    /**
     * Annuler un payout
     */
    async cancel(payoutId: string) {
        return this.prisma.$transaction(async (tx) => {
            const payout = await tx.payout.findUnique({
                where: { id: payoutId },
            });

            if (!payout) {
                throw new NotFoundException(PayoutMessages.NOT_FOUND);
            }

            if (payout.status === 'PAID') {
                throw new BadRequestException(PayoutMessages.INVALID_STATUS);
            }

            await tx.payout.update({
                where: { id: payoutId },
                data: { status: 'CANCELLED' },
            });

            const result = await this.getPayoutWithRelations(tx, payoutId);
            if (!result) {
                throw new NotFoundException('Distribution introuvable après annulation.');
            }

            return ApiResponse.success(
                this.payoutMapper.toResponse(result),
                PayoutMessages.CANCELLED,
            );
        });
    }

    /**
     * Lister les payouts avec pagination
     */
    async findAll(query: FindPayoutsDto) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 20;
        const skip = (page - 1) * limit;

        const where: Prisma.PayoutWhereInput = {};

        if (query.status) {
            where.status = query.status;
        }

        if (query.cycleId) {
            where.cycleId = query.cycleId;
        }

        if (query.tontineId) {
            where.cycle = { tontineId: query.tontineId };
        }

        const [payouts, total] = await Promise.all([
            this.payoutLoader.findMany(where, skip, limit),
            this.payoutLoader.count(where),
        ]);

        return ApiResponse.success(
            this.payoutMapper.toPaginatedResponse(payouts, { page, limit, total }),
            PayoutMessages.LIST,
        );
    }

    /**
     * Obtenir un payout par ID
     */
    async findOne(payoutId: string) {
        const payout = await this.payoutLoader.findById(payoutId);

        if (!payout) {
            throw new NotFoundException(PayoutMessages.NOT_FOUND);
        }

        return ApiResponse.success(
            this.payoutMapper.toResponse(payout),
            PayoutMessages.FOUND,
        );
    }

    // ─── Payout Orders (Tirage / Ordre de passage) ─────────────────────────

    /**
     * Générer automatiquement les PayoutOrders pour une tontine
     */
    async generateOrders(tontineId: string, dto?: GeneratePayoutOrdersDto) {
        return this.prisma.$transaction(async (tx) => {
            const activeMemberships = await tx.membership.findMany({
                where: { tontineId, status: 'ACTIVE' },
            });

            if (activeMemberships.length === 0) {
                throw new BadRequestException('Aucun membre actif dans cette tontine.');
            }

            let sortedMemberships = [...activeMemberships];
            if (dto?.randomize ?? true) {
                sortedMemberships.sort(() => Math.random() - 0.5);
            }

            // Réinitialiser les ordres existants non complétés
            await tx.payoutOrder.deleteMany({
                where: { tontineId },
            });

            const ordersData = sortedMemberships.map((m, idx) => ({
                tontineId,
                membershipId: m.id,
                sequence: idx + 1,
                status: 'SCHEDULED' as const,
            }));

            await tx.payoutOrder.createMany({
                data: ordersData,
            });

            const orders = await tx.payoutOrder.findMany({
                where: { tontineId },
                include: payoutOrderDetailsInclude,
                orderBy: { sequence: 'asc' },
            });

            return ApiResponse.created(
                this.payoutMapper.toOrderListResponse(orders),
                PayoutMessages.ORDERS_GENERATED,
            );
        });
    }

    /**
     * Obtenir la liste des ordres de passage pour une tontine
     */
    async getOrders(tontineId: string) {
        const orders = await this.payoutLoader.findOrdersByTontine(tontineId);

        return ApiResponse.success(
            this.payoutMapper.toOrderListResponse(orders),
            PayoutMessages.LIST,
        );
    }

    /**
     * Échanger le tour entre deux membres (Swap)
     */
    async swapOrders(tontineId: string, dto: SwapPayoutOrdersDto) {
        return this.prisma.$transaction(async (tx) => {
            const first = await tx.payoutOrder.findFirst({
                where: { id: dto.firstOrderId, tontineId },
            });

            const second = await tx.payoutOrder.findFirst({
                where: { id: dto.secondOrderId, tontineId },
            });

            if (!first || !second) {
                throw new NotFoundException(PayoutMessages.ORDER_NOT_FOUND);
            }

            const tempSeq = -1;

            await tx.payoutOrder.update({
                where: { id: first.id },
                data: { sequence: tempSeq },
            });

            await tx.payoutOrder.update({
                where: { id: second.id },
                data: {
                    sequence: first.sequence,
                    exchangedWithOrderId: first.id,
                },
            });

            await tx.payoutOrder.update({
                where: { id: first.id },
                data: {
                    sequence: second.sequence,
                    exchangedWithOrderId: second.id,
                },
            });

            const updatedOrders = await tx.payoutOrder.findMany({
                where: { tontineId },
                include: payoutOrderDetailsInclude,
                orderBy: { sequence: 'asc' },
            });

            return ApiResponse.success(
                this.payoutMapper.toOrderListResponse(updatedOrders),
                PayoutMessages.ORDERS_SWAPPED,
            );
        });
    }
}
