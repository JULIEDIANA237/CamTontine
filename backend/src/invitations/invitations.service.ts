import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { ApiResponse } from '../common/responses';
import { InvitationMessages } from '../common/messages/invitation.messages';
import { InvitationMapper } from './mappers/invitation.mapper';
import { InvitationLoader } from './loaders/invitation.loader';

import { CreateInvitationDto } from './dto/requests/create-invitation.dto';
import { FindInvitationsDto } from './dto/requests/find-invitations.dto';

import { invitationDetailsInclude } from './invitation.prisma';

@Injectable()
export class InvitationsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly invitationMapper: InvitationMapper,
        private readonly invitationLoader: InvitationLoader,
    ) {}

    private async getInvitationWithRelations(
        db: PrismaService | Prisma.TransactionClient,
        invitationId: string,
    ) {
        return db.invitation.findUnique({
            where: { id: invitationId },
            include: invitationDetailsInclude,
        });
    }

    /**
     * Envoyer une invitation à rejoindre une tontine
     */
    async create(tontineId: string, invitedById: string, dto: CreateInvitationDto) {
        return this.prisma.$transaction(async (tx) => {
            const tontine = await tx.tontine.findUnique({
                where: { id: tontineId },
            });

            if (!tontine) {
                throw new NotFoundException('Tontine introuvable.');
            }

            if (!dto.email && !dto.phone) {
                throw new BadRequestException('Au moins un e-mail ou un téléphone est requis.');
            }

            // Générer un jeton unique (token) de 32 octets hex
            const token = randomBytes(32).toString('hex');
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7); // Valide 7 jours

            const invitation = await tx.invitation.create({
                data: {
                    tontineId,
                    invitedById,
                    email: dto.email,
                    phone: dto.phone,
                    token,
                    status: 'PENDING',
                    expiresAt,
                },
            });

            const result = await this.getInvitationWithRelations(tx, invitation.id);
            if (!result) {
                throw new NotFoundException('Invitation introuvable après création.');
            }

            return ApiResponse.created(
                this.invitationMapper.toResponse(result),
                InvitationMessages.CREATED,
            );
        });
    }

    /**
     * Obtenir les détails d'une invitation via son token
     */
    async findByToken(token: string) {
        const invitation = await this.invitationLoader.findByToken(token);

        if (!invitation) {
            throw new NotFoundException(InvitationMessages.NOT_FOUND);
        }

        if (invitation.expiresAt < new Date()) {
            throw new BadRequestException(InvitationMessages.EXPIRED);
        }

        return ApiResponse.success(
            this.invitationMapper.toResponse(invitation),
            InvitationMessages.FOUND,
        );
    }

    /**
     * Accepter une invitation et ajouter l'utilisateur comme membre
     */
    async accept(token: string, userId: string) {
        return this.prisma.$transaction(async (tx) => {
            const invitation = await tx.invitation.findUnique({
                where: { token },
            });

            if (!invitation) {
                throw new NotFoundException(InvitationMessages.NOT_FOUND);
            }

            if (invitation.status !== 'PENDING') {
                throw new BadRequestException(InvitationMessages.INVALID_STATUS);
            }

            if (invitation.expiresAt < new Date()) {
                await tx.invitation.update({
                    where: { id: invitation.id },
                    data: { status: 'EXPIRED' },
                });
                throw new BadRequestException(InvitationMessages.EXPIRED);
            }

            // Vérifier si l'utilisateur est déjà membre
            const existingMembership = await tx.membership.findUnique({
                where: {
                    userId_tontineId: {
                        userId,
                        tontineId: invitation.tontineId,
                    },
                },
            });

            if (existingMembership) {
                throw new ConflictException(InvitationMessages.ALREADY_MEMER);
            }

            // Créer le membership
            await tx.membership.create({
                data: {
                    userId,
                    tontineId: invitation.tontineId,
                    role: 'MEMBER',
                    status: 'ACTIVE',
                },
            });

            // Marquer l'invitation acceptée
            await tx.invitation.update({
                where: { id: invitation.id },
                data: {
                    status: 'ACCEPTED',
                    acceptedAt: new Date(),
                },
            });

            const result = await this.getInvitationWithRelations(tx, invitation.id);
            if (!result) {
                throw new NotFoundException('Invitation introuvable après acceptation.');
            }

            return ApiResponse.success(
                this.invitationMapper.toResponse(result),
                InvitationMessages.ACCEPTED,
            );
        });
    }

    /**
     * Refuser une invitation
     */
    async decline(token: string) {
        return this.prisma.$transaction(async (tx) => {
            const invitation = await tx.invitation.findUnique({
                where: { token },
            });

            if (!invitation) {
                throw new NotFoundException(InvitationMessages.NOT_FOUND);
            }

            if (invitation.status !== 'PENDING') {
                throw new BadRequestException(InvitationMessages.INVALID_STATUS);
            }

            await tx.invitation.update({
                where: { id: invitation.id },
                data: { status: 'DECLINED' },
            });

            const result = await this.getInvitationWithRelations(tx, invitation.id);
            if (!result) {
                throw new NotFoundException('Invitation introuvable après refus.');
            }

            return ApiResponse.success(
                this.invitationMapper.toResponse(result),
                InvitationMessages.DECLINED,
            );
        });
    }

    /**
     * Lister les invitations d'une tontine
     */
    async findAllForTontine(tontineId: string, query: FindInvitationsDto) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 20;
        const skip = (page - 1) * limit;

        const where: Prisma.InvitationWhereInput = { tontineId };

        if (query.status) {
            where.status = query.status;
        }

        const [invitations, total] = await Promise.all([
            this.invitationLoader.findMany(where, skip, limit),
            this.invitationLoader.count(where),
        ]);

        return ApiResponse.success(
            this.invitationMapper.toPaginatedResponse(invitations, { page, limit, total }),
            InvitationMessages.LIST,
        );
    }
}
