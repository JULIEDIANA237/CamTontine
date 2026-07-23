import { Injectable } from '@nestjs/common';
import { BaseMapper } from '../../common/mappers';
import { NotificationResponseDto } from '../dto/responses/notification-response.dto';
import { NotificationListItemDto } from '../dto/responses/notification-list-item.dto';
import { NotificationWithRelations } from '../notification.prisma';

@Injectable()
export class NotificationMapper extends BaseMapper<
    NotificationWithRelations,
    NotificationResponseDto,
    NotificationListItemDto
> {
    override toResponse(notification: NotificationWithRelations): NotificationResponseDto {
        return {
            id: notification.id,
            userId: notification.userId,
            title: notification.title,
            message: notification.message,
            channel: notification.channel,
            status: notification.status,
            sentAt: notification.sentAt,
            readAt: notification.readAt,
            createdAt: notification.createdAt,
            user: {
                id: notification.user.id,
                firstName: notification.user.firstName,
                lastName: notification.user.lastName,
                email: notification.user.email,
            },
        };
    }

    override toListItem(notification: NotificationWithRelations): NotificationListItemDto {
        return {
            id: notification.id,
            title: notification.title,
            message: notification.message,
            channel: notification.channel,
            status: notification.status,
            readAt: notification.readAt,
            createdAt: notification.createdAt,
        };
    }
}
