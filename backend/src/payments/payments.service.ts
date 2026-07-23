import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ApiResponse } from '../common/responses';
import { PaymentMessages } from '../common/messages/payment.messages';
import { PaymentMapper } from './mappers/payment.mapper';
import { PaymentLoader } from './loaders/payment.loader';

import { CreatePaymentDto } from './dto/requests/create-payment.dto';
import { FindPaymentsDto } from './dto/requests/find-payments.dto';
import { ProcessPaymentDto } from './dto/requests/process-payment.dto';

import { paymentDetailsInclude } from './payment.prisma';

@Injectable()
export class PaymentsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly paymentMapper: PaymentMapper,
        private readonly paymentLoader: PaymentLoader,
    ) {}

    private async getPaymentWithRelations(
        db: PrismaService | Prisma.TransactionClient,
        paymentId: string,
    ) {
        return db.payment.findUnique({
            where: { id: paymentId },
            include: paymentDetailsInclude,
        });
    }

    /**
     * Initier/créer un paiement pour une contribution
     */
    async create(dto: CreatePaymentDto) {
        return this.prisma.$transaction(async (tx) => {
            const contribution = await tx.contribution.findUnique({
                where: { id: dto.contributionId },
            });

            if (!contribution) {
                throw new NotFoundException(PaymentMessages.CONTRIBUTION_NOT_FOUND);
            }

            if (contribution.status === 'PAID' || contribution.status === 'VALIDATED') {
                throw new BadRequestException(PaymentMessages.CONTRIBUTION_ALREADY_PAID);
            }

            const existingPayment = await tx.payment.findUnique({
                where: { contributionId: dto.contributionId },
            });

            if (existingPayment && existingPayment.status === 'SUCCESS') {
                throw new ConflictException(PaymentMessages.ALREADY_EXISTS);
            }

            const receiptNumber = `REC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

            const payment = existingPayment
                ? await tx.payment.update({
                      where: { id: existingPayment.id },
                      data: {
                          method: dto.method,
                          amount: dto.amount,
                          transactionReference: dto.transactionReference,
                          status: 'PENDING',
                      },
                  })
                : await tx.payment.create({
                      data: {
                          contributionId: dto.contributionId,
                          method: dto.method,
                          amount: dto.amount,
                          transactionReference: dto.transactionReference,
                          receiptNumber,
                          status: 'PENDING',
                      },
                  });

            const result = await this.getPaymentWithRelations(tx, payment.id);
            if (!result) {
                throw new NotFoundException('Paiement introuvable après création.');
            }

            return ApiResponse.created(
                this.paymentMapper.toResponse(result),
                PaymentMessages.CREATED,
            );
        });
    }

    /**
     * Traiter le résultat d'un paiement (Passer à SUCCESS ou FAILED)
     */
    async process(paymentId: string, dto: ProcessPaymentDto) {
        return this.prisma.$transaction(async (tx) => {
            const payment = await tx.payment.findUnique({
                where: { id: paymentId },
                include: { contribution: true },
            });

            if (!payment) {
                throw new NotFoundException(PaymentMessages.NOT_FOUND);
            }

            if (payment.status === 'SUCCESS') {
                throw new BadRequestException(PaymentMessages.INVALID_STATUS);
            }

            const now = new Date();

            const updatedPayment = await tx.payment.update({
                where: { id: paymentId },
                data: {
                    status: dto.status,
                    receiptNumber: dto.receiptNumber ?? payment.receiptNumber,
                    externalReference: dto.externalReference ?? payment.externalReference,
                    paidAt: dto.status === 'SUCCESS' ? now : null,
                },
            });

            if (dto.status === 'SUCCESS') {
                await tx.contribution.update({
                    where: { id: payment.contributionId },
                    data: {
                        status: 'PAID',
                        paidAt: now,
                    },
                });
            }

            const result = await this.getPaymentWithRelations(tx, updatedPayment.id);
            if (!result) {
                throw new NotFoundException('Paiement introuvable après traitement.');
            }

            return ApiResponse.success(
                this.paymentMapper.toResponse(result),
                PaymentMessages.PROCESSED,
            );
        });
    }

    /**
     * Rembourser un paiement
     */
    async refund(paymentId: string) {
        return this.prisma.$transaction(async (tx) => {
            const payment = await tx.payment.findUnique({
                where: { id: paymentId },
            });

            if (!payment) {
                throw new NotFoundException(PaymentMessages.NOT_FOUND);
            }

            if (payment.status !== 'SUCCESS') {
                throw new BadRequestException(PaymentMessages.INVALID_STATUS);
            }

            await tx.payment.update({
                where: { id: paymentId },
                data: { status: 'REFUNDED' },
            });

            await tx.contribution.update({
                where: { id: payment.contributionId },
                data: { status: 'CANCELLED' },
            });

            const result = await this.getPaymentWithRelations(tx, paymentId);
            if (!result) {
                throw new NotFoundException('Paiement introuvable après remboursement.');
            }

            return ApiResponse.success(
                this.paymentMapper.toResponse(result),
                PaymentMessages.REFUNDED,
            );
        });
    }

    /**
     * Lister les paiements avec pagination et filtres
     */
    async findAll(query: FindPaymentsDto) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 20;
        const skip = (page - 1) * limit;

        const where: Prisma.PaymentWhereInput = {};

        if (query.status) {
            where.status = query.status;
        }

        if (query.method) {
            where.method = query.method;
        }

        if (query.contributionId) {
            where.contributionId = query.contributionId;
        }

        const [payments, total] = await Promise.all([
            this.paymentLoader.findMany(where, skip, limit),
            this.paymentLoader.count(where),
        ]);

        return ApiResponse.success(
            this.paymentMapper.toPaginatedResponse(payments, {
                page,
                limit,
                total,
            }),
            PaymentMessages.LIST,
        );
    }

    /**
     * Obtenir un paiement par ID
     */
    async findOne(paymentId: string) {
        const payment = await this.paymentLoader.findById(paymentId);

        if (!payment) {
            throw new NotFoundException(PaymentMessages.NOT_FOUND);
        }

        return ApiResponse.success(
            this.paymentMapper.toResponse(payment),
            PaymentMessages.FOUND,
        );
    }
}
