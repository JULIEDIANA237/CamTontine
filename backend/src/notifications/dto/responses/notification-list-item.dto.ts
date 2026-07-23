import { ApiProperty } from '@nestjs/swagger';
import { NotificationChannel, NotificationStatus } from '@prisma/client';

export class NotificationListItemDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    message: string;

    @ApiProperty({ enum: NotificationChannel })
    channel: NotificationChannel;

    @ApiProperty({ enum: NotificationStatus })
    status: NotificationStatus;

    @ApiProperty({ nullable: true })
    readAt: Date | null;

    @ApiProperty()
    createdAt: Date;
}
