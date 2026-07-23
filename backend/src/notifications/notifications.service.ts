import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ApiResponse } from '../common/responses';
import { NotificationMessages } from '../common/messages/notification.messages';
import { NotificationMapper } from './mappers/notification.mapper';
import { NotificationLoader } from './loaders/notification.loader';

import { CreateNotificationDto } from './dto/requests/create-notification.dto';
import { FindNotificationsDto } from './dto/requests/find-notifications.dto';

import { notificationDetailsInclude } from './notification.prisma';

@Injectable()
export class NotificationsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly notificationMapper: NotificationMapper,
        private readonly notificationLoader: NotificationLoader,
    ) {}

    private async getNotificationWithRelations(
        db: PrismaService | Prisma.TransactionClient,
        notificationId: string,
    ) {
        return db.notification.findUnique({
            where: { id: notificationId },
            include: notificationDetailsInclude,
        });
    }

    /**
     * Créer une notification
     */
    async create(dto: CreateNotificationDto) {
        return this.prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({
                where: { id: dto.userId },
            });

            if (!user) {
                throw new NotFoundException('Utilisateur introuvable.');
            }

            const created = await tx.notification.create({
                data: {
                    userId: dto.userId,
                    title: dto.title,
                    message: dto.message,
                    channel: dto.channel,
                    status: 'PENDING',
                },
            });

            const result = await this.getNotificationWithRelations(tx, created.id);
            if (!result) {
                throw new NotFoundException('Notification introuvable après création.');
            }

            return ApiResponse.created(
                this.notificationMapper.toResponse(result),
                NotificationMessages.CREATED,
            );
        });
    }

    /**
     * Marquer une notification comme lue
     */
    async markAsRead(notificationId: string, userId: string) {
        return this.prisma.$transaction(async (tx) => {
            const notification = await tx.notification.findFirst({
                where: { id: notificationId, userId },
            });

            if (!notification) {
                throw new NotFoundException(NotificationMessages.NOT_FOUND);
            }

            await tx.notification.update({
                where: { id: notificationId },
                data: { readAt: new Date() },
            });

            const result = await this.getNotificationWithRelations(tx, notificationId);
            if (!result) {
                throw new NotFoundException('Notification introuvable après mise à jour.');
            }

            return ApiResponse.success(
                this.notificationMapper.toResponse(result),
                NotificationMessages.READ,
            );
        });
    }

    /**
     * Marquer toutes les notifications d'un utilisateur comme lues
     */
    async markAllAsRead(userId: string) {
        await this.prisma.notification.updateMany({
            where: { userId, readAt: null },
            data: { readAt: new Date() },
        });

        return ApiResponse.success(null, NotificationMessages.ALL_READ);
    }

    /**
     * Lister les notifications de l'utilisateur connecté
     */
    async findAllForUser(userId: string, query: FindNotificationsDto) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 20;
        const skip = (page - 1) * limit;

        const where: Prisma.NotificationWhereInput = { userId };

        if (query.channel) {
            where.channel = query.channel;
        }

        if (query.status) {
            where.status = query.status;
        }

        if (query.unreadOnly) {
            where.readAt = null;
        }

        const [notifications, total] = await Promise.all([
            this.notificationLoader.findMany(where, skip, limit),
            this.notificationLoader.count(where),
        ]);

        return ApiResponse.success(
            this.notificationMapper.toPaginatedResponse(notifications, { page, limit, total }),
            NotificationMessages.LIST,
        );
    }

    /**
     * Obtenir une notification par ID
     */
    async findOne(notificationId: string, userId: string) {
        const notification = await this.prisma.notification.findFirst({
            where: { id: notificationId, userId },
            include: notificationDetailsInclude,
        });

        if (!notification) {
            throw new NotFoundException(NotificationMessages.NOT_FOUND);
        }

        return ApiResponse.success(
            this.notificationMapper.toResponse(notification),
            NotificationMessages.FOUND,
        );
    }
}
